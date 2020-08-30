import React, { useState, useEffect, useContext } from "react";
import { ProgramContext } from "../../contexts/Program";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import moment from "moment";

import FlowSwitchTwoModal from "../Modals/FlowSwitchTwo/FlowSwitchTwoModal";

import { Form, Input, Button, DatePicker, Select, message, Drawer, Empty, Tag } from "antd";
import "./styles.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;

function PresentationForm(props) {
  const { setFormView } = props;

  const program = useContext(ProgramContext);
  const {
    selectedSessionId,
    getSessionById,
    createPresentation,
    addGlobalPresenter,
    deleteGlobalPresenter,
    globalPresenters,
    getNextPresenterId,
  } = program;

  // State for dynamic presenters
  const [presenters, setPresenters] = useState([]);

  // State for dynamic credits
  const [credits, setCredits] = useState({});

  // Friendly strings for list to render credits
  const [creditsList, setCreditsList] = useState([]);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);

  // Drawer
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  // List data render handling
  useEffect(() => {
    // List only renders array of strings so extract them from presenters state
    const names = presenters.map((presenter) => {
      return presenter.name;
    });

    form.setFieldsValue({ presenter: "", presenterList: names });

    console.log("Local Presenter List", presenters);
  }, [presenters]);

  useEffect(() => {
    // Clear credit fields & update credit list select state
    form.setFieldsValue({
      creditType: "",
      creditAmount: 0,
      creditList: creditsList,
    });
  }, [creditsList]);

  const formSubmit = (values) => {
    // Date range validation helper func
    const isValidPresentationDateRange = (start, end) => {
      const session = getSessionById(selectedSessionId);

      if (start.isBefore(moment(session.dateStart)) || end.isAfter(moment(session.dateEnd))) {
        return false;
      }
      return true;
    };

    // Error handling for select inputs on form submit
    // We need 1 presenter and 1 credit type minimum
    if (presenters.length === 0) {
      form.setFields([
        {
          name: "presenterList",
          errors: ["Must have atleast 1 presenter."],
        },
      ]);
    } else if (Object.keys(credits).length === 0) {
      form.setFields([
        {
          name: "creditList",
          errors: ["Must have atleast 1 credit type added."],
        },
      ]);
    } else {
      // Use mix of form data & state from inputs to create a new presentation
      const start = values.presentationLength[0].second(0).millisecond(0);
      const end = values.presentationLength[1].second(0).millisecond(0);

      if (isValidPresentationDateRange(start, end)) {
        createPresentation(selectedSessionId, {
          name: values.presentationName,
          dateStart: start._d,
          dateEnd: end._d,
          presenters: presenters.map((presenter) => presenter.name),
          credits: credits,
        });

        message.success(`Presentation ${values.presentationName} created!`);

        setTimeout(() => {
          setModalVisible(true);
        }, 200);

        // Clear form data and old state in case user wants to add another presentation
        setCredits({});
        setPresenters([]);
        setCreditsList([]);

        form.resetFields();
      } else {
        message.error("Presentation date range is outside the bounds of current session.", 5);

        form.setFields([
          {
            name: "presentationLength",
            errors: ["Date range outside bounds of current session."],
          },
        ]);
      }
    }
  };

  const addPresenter = () => {
    /*
      1. Add presenter to global list if applicable
      2. Add presenter to presentation
    */

    if (form.getFieldValue("presenter")) {
      const presenter = form.getFieldValue("presenter");

      setPresenters([...presenters, { name: presenter, id: String(getNextPresenterId()) }]);

      console.log("Add presenter local & global", presenter);
      addGlobalPresenter(presenter);
    } else {
      form.setFields([
        {
          name: "presenter",
          errors: ["Must include a presenter to add."],
        },
      ]);
    }
  };

  const addCredit = () => {
    // HELPER FUNC
    const clearErrors = () => {
      form.setFields([
        {
          name: "creditType",
          errors: [],
        },
        {
          name: "creditAmount",
          errors: [],
        },
      ]);
    };

    const creditType = form.getFieldValue("creditType");
    const creditAmount = form.getFieldValue("creditAmount");

    const newCredit = {};
    newCredit[creditType] = creditAmount;

    if (creditType && creditAmount) {
      clearErrors();

      setCredits({ ...credits, ...newCredit });

      setCreditsList([...creditsList, `${creditType} | ${creditAmount}`]);
    } else {
      form.setFields([
        {
          name: "creditType",
          errors: ["Required to add a credit to presentation."],
        },
        {
          name: "creditAmount",
          errors: ["Required to add a credit to presentation."],
        },
      ]);
    }
  };

  const removeCredit = (values) => {
    setCredits(values);
  };

  /* FORM FIELD REQUIREMENTS
    Presentation Name
    DateTime start / end
    Presenters * Dynamic, Add presenter btn
    Credit Type + Credit Value * Dynamic, Add credit btn
  */

  const selectPresenter = (presenter) => {
    /*
      1. Add to global list if applicable
      2. Add to local presentation
      3. Inc next id
    */

    console.log("Select presenter", presenter);

    setPresenters([...presenters, { name: presenter, id: String(getNextPresenterId()) }]);
    addGlobalPresenter(presenter);
  };

  const deselectPresenter = (presenter) => {
    console.log("deselect presenter", presenter);
    /*
      1. Remove from global list if applicable
      2. Remove from presentation
    */

    deleteGlobalPresenter(presenter);

    setPresenters(presenters.filter((p) => (p.name !== presenter ? true : false)));
  };

  const onClose = (e) => {
    setVisible(false);
  };

  const reorderPresenters = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // This is the style for each draggable element
  const getDraggableItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 16,
    marginBottom: 16,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "white",
    boxShadow: "0 0 3px 1px rgba(40, 40, 40, 0.35)",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  // This is the style for the container that holds the draggables
  const getListStyle = () => ({
    padding: 8,
    width: "100%",
  });

  const onDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const orderedPresenters = reorderPresenters(presenters, result.source.index, result.destination.index);

    setPresenters(orderedPresenters);
  };

  const disabledDate = (date) => {
    const session = getSessionById(selectedSessionId);

    const formattedDate = moment(date).hour(0).minute(0).second(0).millisecond(0);
    
    const programStart = moment(session.dateStart).hour(0).minute(0).second(0).millisecond(0);
    const programEnd = moment(session.dateEnd).hour(0).minute(0).second(0).millisecond(0);
    
    return formattedDate.isBefore(programStart) || formattedDate.isAfter(programEnd);
  }

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const disabledTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        // disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      // disabledSeconds: () => [55, 56],
    };
  }

  return (
    <>
      {/* UI Flow Modal for jumping to review program or add additional presentation */}
      <FlowSwitchTwoModal isVisible={modalVisible} setVisibility={setModalVisible} setFormView={setFormView} />

      {/* Form Wrapper*/}
      <div className="presentation-form-container">
        {/* DnD Presenter Drawer */}
        <Drawer
          title="Presenters"
          placement="right"
          closable={true}
          onClose={onClose}
          visible={visible}
          getContainer={false}
          style={{ position: "absolute" }}>
          {/* Create DnD component or an Empty depending on presenter count */}
          {presenters.length > 1 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {presenters.map((presenter, index) => (
                      // Render draggables for each presenter
                      <Draggable key={presenter.id} draggableId={presenter.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getDraggableItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                            {presenter.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          <Button onClick={onClose} type="primary" htmlType="button" style={{ width: "100%" }}>
            Done
          </Button>
        </Drawer>

        {/* THE BIG FORM */}
        <Form
          form={form}
          name="presentationForm"
          initialValues={{
            creditAmount: 0,
          }}
          onFinish={formSubmit}
          autoComplete="off"
          layout={"vertical"}
          hideRequiredMark>
          {/* PRESENTATION NAME */}
          <Form.Item
            label="Presentation Name"
            name="presentationName"
            rules={[{ required: true, message: "Input a name for this presentation." }]}>
            <Input />
          </Form.Item>

          {/* PRESENTATION TIME RANGE */}
          <Form.Item
            label="Presentation Start & End Times"
            name="presentationLength"
            rules={[{ required: true, message: "Input a time range for this presentation." }]}>
            <RangePicker disabledDate={disabledDate} disabledTime={disabledTime} showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={5} />
          </Form.Item>

          {/* PRESENTER INPUT */}
          <Form.Item label="Presenter" name="presenter">
            <Input />
          </Form.Item>

          {/* PRESENTER BUTTONS */}
          <Form.Item>
            <Button type="primary" htmlType="button" onClick={addPresenter}>
              Add Presenter
            </Button>
            <Button type="primary" htmlType="button" onClick={() => setVisible(true)}>
              Re-order Presenters
            </Button>
          </Form.Item>

          {/* PRESENTER LIST */}
          <Form.Item label="Current Presenter List" name="presenterList">
            <Select
              mode="multiple"
              onSelect={selectPresenter}
              onDeselect={deselectPresenter}
              placeholder="Presenters previously used can be selected here.">
              {globalPresenters.map((presenter, idx) => {
                return (
                  <Option key={idx} value={presenter}>
                    {presenter}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {/* CREDIT TYPE / AMOUNT INPUTS */}
          <Form.Item label="Credit Type" name="creditType">
            <Input />
          </Form.Item>
          <Form.Item label="Credit Amount" name="creditAmount">
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="button" onClick={addCredit}>
              Add Credit
            </Button>
          </Form.Item>

          {/* CREDIT LIST */}
          <Form.Item label="Current Credits" name="creditList">
            <Select mode="multiple" onChange={removeCredit} placeholder="Credits will display here as they are added.">
              {creditsList.map((credit, idx) => {
                return (
                  <Option key={idx} value={credit}>
                    {credit}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {/* SUBMIT */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Presentation
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default PresentationForm;

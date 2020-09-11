import React, { useState, useEffect, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import { useHistory, useLocation } from "react-router-dom";

import FlowSwitchTwoModal from "../../Modals/FlowSwitchTwo/FlowSwitchTwoModal";
import PresenterDnD from "./PresenterDnD";
import PresenterInput from "./PresenterInput";
import CreditInput from "./CreditInput";

import { Row, Col, Divider, Skeleton } from "antd";
import { Form, Input, Button, message } from "antd";

// Styles for getting dnd drawer working correctly
import "./styles.scss";

function PresentationForm(props) {
  const { initialFormMode, initialFormValues } = props;

  const program = useContext(ProgramContext);
  const { selectedSessionId, selectSession, createPresentation, editPresentation } = program;

  const history = useHistory();

  const location = useLocation();

  const { sessionId, presentationId } = location.state;

  // UI  Modal
  const [modalVisible, setModalVisible] = useState(false);

  // "add" / "edit"
  const [formMode] = useState(initialFormMode);

  // State for dynamic presenters
  const [presenters, setPresenters] = useState([]);

  // State for dynamic credits
  const [credits, setCredits] = useState({});

  // Friendly strings for list to render credits
  const [creditsList, setCreditsList] = useState([]);

  // DnD Drawer
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [form] = Form.useForm();

  // Input prefill
  const [prefillValues, setPrefillValues] = useState({ creditAmount: 0 });

  // Used when adding presentation from agenda
  useEffect(() => {
    if (sessionId >= 0) {
      selectSession(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    // Handles all UI flows (add, add / edit from agenda)
    if (initialFormValues) {
      if (initialFormValues.presentationName) {
        // This control flow is when a user clicks edit
        setPresenters(initialFormValues.presenters);
        setCredits(initialFormValues.credits);
        setCreditsList(initialFormValues.creditsList);
      }

      // This is used by all flows regardless
      setPrefillValues({
        ...initialFormValues,
        creditAmount: 0,
      });
    }
  }, [initialFormValues]);

  useEffect(() => {
    form.resetFields();
  }, [formMode, prefillValues]);

  const formSubmit = (values) => {
    // We need 1 presenter minimum
    if (presenters.length === 0) {
      form.setFields([
        {
          name: "presenterList",
          errors: ["Must have atleast 1 presenter."],
        },
      ]);
    } else {
      const presentation = {
        name: values.presentationName,
        presenters: presenters.map((presenter) => presenter.name),
        credits: credits,
      };

      if (formMode === "edit") {
        editPresentation(presentationId, presentation);

        message.success(`Presentation ${values.presentationName} modified!`);

        history.push("/review");
      } else {
        createPresentation(selectedSessionId, presentation);

        message.success(`Presentation ${values.presentationName} created!`);

        setTimeout(() => {
          setModalVisible(true);
        }, 200);

        // Clear form data and old state in case user wants to add another presentation
        setCredits({});
        setPresenters([]);
        setCreditsList([]);

        form.resetFields();
      }
    }
  };

  /* FORM FIELD REQUIREMENTS
    Presentation Name
    Presenters * Dynamic, Add presenter btn, Re-order presenters dnd
    Credit Type + Credit Value * Dynamic, Add credit btn
  */

  return selectedSessionId >= 0 ? (
    <>
      <FlowSwitchTwoModal isVisible={modalVisible} setVisibility={setModalVisible} />

      <div className="presentation-form-container">
        <PresenterDnD
          visible={drawerVisible}
          setVisible={setDrawerVisible}
          presenters={presenters}
          setPresenters={setPresenters}
        />

        <Form
          form={form}
          name="presentationForm"
          initialValues={prefillValues}
          onFinish={formSubmit}
          autoComplete="off"
          hideRequiredMark>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Presentation Name"
                labelCol={{ span: 24 }}
                name="presentationName"
                rules={[{ required: true, message: "Input a name for this presentation." }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <PresenterInput
            parentForm={form}
            presenters={presenters}
            setPresenters={setPresenters}
            setDrawerVisible={setDrawerVisible}
          />

          <Divider />

          <CreditInput
            parentForm={form}
            credits={credits}
            setCredits={setCredits}
            creditsList={creditsList}
            setCreditsList={setCreditsList}
          />

          <Divider />

          <Row>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {formMode === "edit" ? "Edit Presentation" : "Add Presentation"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  ) : (
    <Skeleton />
  );
}

export default PresentationForm;

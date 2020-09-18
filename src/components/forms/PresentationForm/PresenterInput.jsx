import React, { useEffect, useRef, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import { Row, Col } from "antd";
import { Form, Input, Button, Select } from "antd";
const { Option } = Select;

function PresenterInput(props) {
  const { parentForm, presenters, setPresenters, setDrawerVisible } = props;

  const program = useContext(ProgramContext);
  const { addGlobalPresenter, deleteGlobalPresenter, globalPresenters, getNextPresenterId } = program;

  const presenterInputElement = useRef(null);

  // List data render handling
  useEffect(() => {
    // List only renders array of strings so extract them from presenters state
    const names = presenters.map((presenter) => {
      return presenter.name;
    });

    parentForm.setFieldsValue({ presenter: "", presenterList: names });
  }, [presenters, parentForm]);

  const addPresenter = () => {
    /*
      1. Add presenter to global list if applicable
      2. Add presenter to presentation
    */

    if (parentForm.getFieldValue("presenter")) {
      const presenter = parentForm.getFieldValue("presenter");

      setPresenters([...presenters, { name: presenter, id: String(getNextPresenterId()) }]);

      addGlobalPresenter(presenter);
    } else {
      parentForm.setFields([
        {
          name: "presenter",
          errors: ["Must include a presenter to add."],
        },
      ]);
    }

    // Set focus back to presenter input
    presenterInputElement.current.focus();
  };

  const selectPresenter = (presenter) => {
    /*
      1. Add to global list if applicable
      2. Add to local presentation
      3. Inc next id
    */

    addGlobalPresenter(presenter);

    setPresenters([...presenters, { name: presenter, id: String(getNextPresenterId()) }]);
  };

  const deselectPresenter = (presenter) => {
    /*
      1. Remove from global list if applicable
      2. Remove from presentation
    */

    deleteGlobalPresenter(presenter);

    setPresenters(presenters.filter((p) => (p.name !== presenter ? true : false)));
  };

  return (
    <>
      {/* PRESENTER INPUT */}
      <Row gutter={0}>
        <Col span={24}>
          {/* I'M NOT PROUD OF THIS... */}
          <Form.Item label="Presenter" colon={false} style={{ margin: "10px 0" }}></Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Form.Item name="presenter">
            <Input ref={presenterInputElement} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Button type="primary" htmlType="button" onClick={addPresenter}>
            Add Presenter
          </Button>
        </Col>
      </Row>

      {/* PRESENTER LIST */}
      <Row>
        <Col span={24}>
          <Form.Item label="Current Presenter List" labelCol={{ span: 24 }} name="presenterList">
            <Select
              mode="multiple"
              onSelect={selectPresenter}
              onDeselect={deselectPresenter}
              defaultValue={presenters.map((p) => p.name)}
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
        </Col>
      </Row>

      {/* PRESENTER BUTTONS */}
      <Row>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="button" onClick={() => setDrawerVisible(true)}>
              Re-order Presenters
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

export default PresenterInput;

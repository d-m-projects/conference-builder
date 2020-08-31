import React, { useEffect, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import { Form, Input, Button, Select } from "antd";
const { Option } = Select;

function PresenterInput(props) {
  const { parentForm, presenters, setPresenters, setDrawerVisible } = props;

  const program = useContext(ProgramContext);
  const { addGlobalPresenter, deleteGlobalPresenter, globalPresenters, getNextPresenterId } = program;

  // List data render handling
  useEffect(() => {
    // List only renders array of strings so extract them from presenters state
    const names = presenters.map((presenter) => {
      return presenter.name;
    });

    parentForm.setFieldsValue({ presenter: "", presenterList: names });
  }, [presenters]);

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
  };

  const selectPresenter = (presenter) => {
    /*
      1. Add to global list if applicable
      2. Add to local presentation
      3. Inc next id
    */

    setPresenters([...presenters, { name: presenter, id: String(getNextPresenterId()) }]);
    addGlobalPresenter(presenter);
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
      <Form.Item label="Presenter" name="presenter">
        <Input />
      </Form.Item>

      {/* PRESENTER BUTTONS */}
      <Form.Item>
        <Button type="primary" htmlType="button" onClick={addPresenter}>
          Add Presenter
        </Button>
        <Button type="primary" htmlType="button" onClick={() => setDrawerVisible(true)}>
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
    </>
  );
}

export default PresenterInput;

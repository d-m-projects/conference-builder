import React, { useEffect } from "react";

import { Form, Input, Button, Select } from "antd";
const { Option } = Select;

function CreditInput(props) {
  const { parentForm, credits, setCredits, creditsList, setCreditsList } = props;

  useEffect(() => {
    // Clear credit fields & update credit list select state
    parentForm.setFieldsValue({
      creditType: "",
      creditAmount: 0,
      creditList: creditsList,
    });
  }, [creditsList]);

  const addCredit = () => {
    // HELPER FUNC
    const clearErrors = () => {
      parentForm.setFields([
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

    const creditType = parentForm.getFieldValue("creditType");
    const creditAmount = parentForm.getFieldValue("creditAmount");

    const newCredit = {};
    newCredit[creditType] = creditAmount;

    if (creditType && creditAmount) {
      clearErrors();

      setCredits({ ...credits, ...newCredit });

      setCreditsList([...creditsList, `${creditType} | ${creditAmount}`]);
    } else {
      parentForm.setFields([
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

  return (
    <div>
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
    </div>
  );
}

export default CreditInput;

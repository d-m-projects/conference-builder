import React, { useEffect } from "react";

import { Row, Col } from "antd";
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
    const creditAmount = Number(parentForm.getFieldValue("creditAmount"));

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

  const selectCredit = (credit) => {
    const splitCreds = credit.split(" ");

    const creditKey = splitCreds[0];
    const creditAmount = splitCreds[2];

    const newCredit = {};

    newCredit[creditKey] = creditAmount;

    setCredits({ ...credits, ...newCredit });

    setCreditsList([...creditsList, credit]);
  };

  const deselectCredit = (credit) => {
    const creditKey = credit.split(" ")[0];
    const modCredits = credits;

    delete modCredits[creditKey];

    setCredits(modCredits);

    setCreditsList(creditsList.filter((c) => c !== credit));
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={16}>
          <Form.Item label="Credit Type" labelCol={{ span: 24 }} name="creditType">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Credit Amount" labelCol={{ span: 24 }} name="creditAmount">
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="button" onClick={addCredit}>
              Add Credit
            </Button>
          </Form.Item>
        </Col>
      </Row>

      {/* CREDIT LIST */}
      <Row>
        <Col span={24}>
          <Form.Item label="Current Credits" labelCol={{ span: 24 }} name="creditList">
            <Select
              mode="multiple"
              onSelect={selectCredit}
              onDeselect={deselectCredit}
              defaultValue={creditsList}
              placeholder="Credits will display here as they are added.">
              {creditsList.map((credit, idx) => {
                return (
                  <Option key={credit} value={credit}>
                    {credit}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

export default CreditInput;

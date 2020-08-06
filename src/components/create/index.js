import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Fade from "react-reveal/Fade";

// antd setup
import { Button, Steps, message, Card } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

import CreateProgram from "./components/CreateProgram";
import ManageProgram from "./components/ManageProgram";
import ReviewProgram from "./components/ReviewProgram";

const { Step } = Steps;

const Create = () => {
  const [current, setCurrent] = useState(0);

  let history = useHistory();
  const handleDone = () => {
    message.success("Processing complete!");
    history.push("/");
  };

  const steps = [
    {
      title: "Create Program",
      content: <CreateProgram />,
    },
    {
      title: "Manage Program",
      content: <ManageProgram />,
    },
    {
      title: "Review Program",
      content: <ReviewProgram />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const showsteps = (
    <Steps current={current}>
      {steps.map((item) => (
        <Step key={item.title} title={item.title} />
      ))}
    </Steps>
  );

  return (
    <Card title={showsteps}>
      <Fade>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 &&
            (current === 0 ? (
              <Button type="primary" shape="round" onClick={() => next()}>
                Create
              </Button>
            ) : (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            ))}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleDone}>
              Done
            </Button>
          )}
        </div>
      </Fade>
    </Card>
  );
};

export default Create;

import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { ProgramContext } from "../../contexts/Program";

import Fade from "react-reveal/Fade";
import db from "../../data/database"

// antd setup
import { Button, Steps, message, Card } from "antd";
import "antd/dist/antd.css";

import CreateProgram from "./components/CreateProgram";
import ManageProgram from "./components/ManageProgram";
import ReviewProgram from "./components/ReviewProgram";

const { Step } = Steps;

const Create = () => {
	const [current, setCurrent] = useState(0);
	const history = useHistory();
	const program = useContext(ProgramContext)
	const {clearProgram} = program

	const changeStep = (direction) => {
		setCurrent(current + direction)
		program.current = current
	}

	const next = () => {
		changeStep(+1);
	};

	const prev = () => {
		changeStep(-1);
	};

	const doSubmit = () => {
		message.success("Processing complete!");
		clearProgram();
		history.push("/");
		window.location.reload();
	};

	const steps = [
		{
			title: "Create Program",
			content: <CreateProgram formNext={next} />,
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

	const showsteps = (
		<Steps current={program.current}>
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
						(current === 0 ? null : (
							<Button type="primary" onClick={() => next()}>
								Next
							</Button>
						))}
					{current === steps.length - 1 && (
						<Button type="primary" onClick={doSubmit}>
							Submit
						</Button>
					)}
				</div>
			</Fade>
		</Card>
	);
};

export default Create;

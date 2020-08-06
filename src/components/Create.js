import React, { useState } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Fade from 'react-reveal/Fade'

// antd setup
import { Button, Steps, message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import Step1 from "./create/Step1";
import Step2 from "./create/Step2";
import Step3 from "./create/Step3";
import Step4 from "./create/Step4";

const { Step } = Steps;

const Create = () => {
	const [start, setStart] = useState(false);
	const [current, setCurrent] = useState(0);

	const handleStart = () => {
		setStart(true)
	}

	let history = useHistory();
	const handleDone = () => {
		message.success('Processing complete!');
		history.push("/")
	}

	const steps = [
		{
			title: 'First',
			content: <Step1 />,
		},
		{
			title: 'Second',
			content: <Step2 />,
		},
		{
			title: 'Third',
			content: <Step3 />,
		},
		{
			title: 'Finish',
			content: <Step4 />,
		},
	];

	const next = () => {
		setCurrent(current + 1)
	}

	const prev = () => {
		setCurrent(current - 1)
	}
	const startbutt = (
		<Fade bottom>
			<div>
				<Button type="primary" shape="round" size="large" onClick={handleStart}>Create New</Button>
			</div>
		</Fade>
	)
	const flow = (
		<Fade >
			<Steps current={current}>
				{steps.map(item => (
					<Step key={item.title} title={item.title} />
				))}
			</Steps>
			<div className="steps-content">{steps[current].content}</div>
			<div className="steps-action">
				{current < steps.length - 1 && (
					<Button type="primary" onClick={() => next()}>
						Next
					</Button>
				)}
				{current === steps.length - 1 && (
					<Button type="primary" onClick={handleDone}>
						Done
					</Button>
				)}
				{current > 0 && (
					<Button style={{ margin: '0 8px' }} onClick={() => prev()}>
						Previous
					</Button>
				)}
			</div>
		</Fade>)

	return (
		start
			? flow
			: startbutt
	);
};

export default Create;

import React, { useState } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Fade from 'react-reveal/Fade'

// antd setup
import { Button, Steps, message, Card } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

const { Step } = Steps;

const Create = () => {
	const [current, setCurrent] = useState(0);

	let history = useHistory();
	const handleDone = () => {
		message.success('Processing complete!');
		history.push("/")
	}

	const steps = [
		{
			title: 'Start',
			content: <Step0 />,
		},
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

	const showsteps = (
		<Steps current={current}>
			{steps.map(item => (
				<Step key={item.title} title={item.title} />
			))}
		</Steps>
	)



	return (
		<Card title={showsteps}>
			<Fade >
				<div className="steps-content">
					{steps[current].content}
				</div>
				<div className="steps-action">
					{current > 0 && (
						<Button style={{ margin: '0 8px' }} onClick={() => prev()}>
							Previous
						</Button>
					)}
					{current < steps.length - 1 && (
						current === 0
							? <Button type="primary" shape="round" onClick={() => next()}>Create</Button>
							: <Button type="primary" onClick={() => next()}>Next</Button>
					)}
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

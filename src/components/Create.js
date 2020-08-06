import React, { useState } from 'react';
import { Redirect, useHistory } from "react-router-dom";

// antd setup
import { Button, Steps, message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const {Step} = Steps;

const Create = () => {
	const [start, setStart] = useState(0);
	const [current, setCurrent] = useState(0);

	const handleStart = () => {
		setStart(1)
	}

	let history = useHistory();
	const handleDone = () => {
		message.success('Processing complete!');
		history.push("/")
	}

	const steps = [
		{
			title: 'First',
			content: 'Step One',
		},
		{
			title: 'Second',
			content: 'Step Two',
		},
		{
			title: 'Third',
			content: 'Step Three',
		},
		{
			title: 'Finish',
			content: 'Complete',
		},
	]; 

	const next = () => {
		setCurrent(current + 1)
	}

	const prev = () => {
		setCurrent(current - 1)
	}
	const startbutt = (
		<div>
			<Button type="primary" shape="round" size="large" onClick = {handleStart}>Create New</Button>
		</div>
	)
	const flow = (
		<>
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
		</>	)

	return (
		start
			? flow
			: startbutt
	);
};

export default Create;

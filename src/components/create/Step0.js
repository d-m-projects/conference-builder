import React, {useState} from "react";

// antd setup
import { Button } from 'antd';
import 'antd/dist/antd.css';

const Step0 = () => {
	const [start, setStart] = useState(false);

	const handleStart = () => {
		setStart(true)
	}

	return (
			<div>Creation instructions</div>
	);
};

export default Step0;

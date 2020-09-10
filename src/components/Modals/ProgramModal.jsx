import React, { useState, useContext, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

import moment from "moment";

import { Form, Input, DatePicker, Button, Popconfirm, Modal, Space } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

function ProgramModal(props) {
	const { visible, setVisible } = props;

	const history = useHistory();
	// const location = useLocation();

	const program = useContext(ProgramContext);
	const { editProgram, createProgram } = program;

	const [rangeCondition, setRangeCondition] = useState(true);
	const [popVisible, setPopVisible] = useState(false);
	const [programInfo, setProgramInfo] = useState({})

	const [form] = Form.useForm();


	useEffect(() => {
		const programData = (history.location.pathname === "/manager")
			? {  // if no program data, then we're Creating
				programName: null,
				programLength: [
					moment(),
					moment()
				],
				modalHeader: "Create New Program",
				modalButton: "Continue <DoubleRightOutlined />"
			}
			: {  // if we're getting program data, then we're Editing
				programName: program.name,
				programLength: [
					moment(program.dateStart),
					moment(program.dateEnd)
				],
				modalHeader: `Edit Program ${program.name}`,
				modalButton: "Edit Program"
			}
		setProgramInfo(programData)
	}, [program])

	const handleSubmit = () => {
		// Executes via popover
		// Runs the editProgram func
		const { programName, programLength } = form.getFieldsValue(["programName", "programLength"]);

		editProgram({
			programName,
			programLength: [programLength[0]._d, programLength[1]._d],
		});

		setVisible(false);
	};

	const checkRange = (range) => {
		// onChange of RangePicker -> If date range would remove existing days with sessions
		// then popover will show up if edit button is clicked. Otherwise the edit button will
		// work normally and popover won't show up

		// Start date same or before program date
		// End date same or after program date
		// If so then we don't need to delete any existing days, so no popconfirm dialog

		if (range[0].isSameOrBefore(program.dateStart, "minute") && range[1].isSameOrAfter(program.dateEnd, "minute")) {
			setRangeCondition(true);
		} else {
			setRangeCondition(false);
		}
	};

	const handlePopVis = (visible) => {
		if (!visible) {
			setPopVisible(visible);
			return;
		}

		// Condition to show popconfirm
		if (rangeCondition) {
			handleSubmit();
		} else {
			setPopVisible(visible);
		}
	};

	const handleClose = () => {
		setVisible(false);
	};

	return (
		<Modal
		closable
		title={programInfo.modalHeader} visible={visible} onCancel={handleClose} footer={[]}>
			<Form
				form={form}
				name="editProgramForm"
				initialValues={programInfo}
				onFinish={handleSubmit}
				autoComplete="off"
				layout="vertical"
				hideRequiredMark>
				<Form.Item
					label="Program Name"
					name="programName"
					rules={[{ required: true, message: "Program must have a name." }]}>
					<Input />
				</Form.Item>

				<Form.Item
					label="Program Start & End Dates"
					name="programLength"
					rules={[{ required: true, message: "Program must have a valid date range." }]}>
					<RangePicker onChange={checkRange} showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={5} />
				</Form.Item>

				<Space size={16}>
					<Popconfirm
						title="Date range selected may result in sessions / presentations being deleted, continue anyway?"
						visible={popVisible}
						onVisibleChange={handlePopVis}
						onConfirm={handleSubmit}
						onCancel={() => setPopVisible(false)}
						okText="Yes"
						cancelText="No">
						<Button type="primary" htmlType="submit">
							Edit Program
            			</Button>
					</Popconfirm>
					<Button type="primary" htmlType="button" onClick={handleClose}>
						Cancel
          </Button>
				</Space>
			</Form>
		</Modal>
	);
}

export default ProgramModal;

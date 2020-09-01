import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Drawer, Button, Empty } from "antd";

function PresenterDnD(props) {
	const { visible, setVisible, itemList, setItemList } = props;

	const closeDrawer = () => {
		setVisible(false);
	};

	const reorderList = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onDragEnd = (result) => {
		// Dropped outside the list?
		if (!result.destination) {
			return;
		}

		// Re-order presenter array with changes
		const orderedList = reorderList(itemList, result.source.index, result.destination.index);

		setItemList(orderedList);
	};

	// This is the style for each draggable element
	const getDraggableItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: "none",
		padding: 10,
		marginBottom: 16,
		textAlign: "center",

		// change background colour if dragging
		background: isDragging ? "lightgreen" : "white",
		boxShadow: "0 0 3px 1px rgba(40, 40, 40, 0.35)",

		// styles we need to apply on draggables
		...draggableStyle,
	});

	// This is the style for the container that holds the draggables
	const getListStyle = () => ({
		padding: 8,
		width: "100%",
	});

	return (
		<div className="presenter-dnd-drawer">
			<Drawer
				title="Presenters"
				placement="right"
				closable={true}
				onClose={closeDrawer}
				visible={visible}
				getContainer={false}
				style={{ position: "absolute" }}>
				{itemList.length > 1 ? (
					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId="droppable">
							{(provided, snapshot) => (
								<div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
									{itemList.map((presenter, index) => (
										<Draggable key={presenter.id} draggableId={presenter.id} index={index}>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													style={getDraggableItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
													{presenter.name}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				) : (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					)}

				<Button onClick={closeDrawer} type="primary" htmlType="button" style={{ width: "100%" }}>
					Done
     		   </Button>
			</Drawer>
		</div>
	);
}

export default PresenterDnD;

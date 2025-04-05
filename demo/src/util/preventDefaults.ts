const preventDefaults = (event: { preventDefault: () => void; stopPropagation: () => void; }) => {
	event.preventDefault();
	event.stopPropagation();
};

export {preventDefaults};

const getLeftTopRelativePosition = (element: HTMLElement, parent: HTMLElement): { x: number, y: number } => {
    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return {
        x: rect.left - parentRect.left,
        y: rect.top - parentRect.top
    };
};

const getRightTopRelativePosition = (element: HTMLElement, parent: HTMLElement): { x: number, y: number } => {
    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return {
        x: rect.left - parentRect.left + rect.width, // 右上角的横坐标
        y: rect.top - parentRect.top                 // 右上角的纵坐标
    };
};

const getLeftBottomRelativePosition = (element: HTMLElement, parent: HTMLElement): { x: number, y: number } => {
    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return {
        x: rect.left - parentRect.left,               // 左下角的横坐标
        y: rect.top - parentRect.top + rect.height   // 左下角的纵坐标
    };
};

const getRightBottomRelativePosition = (element: HTMLElement, parent: HTMLElement): { x: number, y: number } => {
    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return {
        x: rect.left - parentRect.left + rect.width, // 右下角的横坐标
        y: rect.top - parentRect.top + rect.height   // 右下角的纵坐标
    };
};

export default {
    getLeftTopRelativePosition,
    getRightTopRelativePosition,
    getLeftBottomRelativePosition,
    getRightBottomRelativePosition
}
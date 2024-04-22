import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

// Предохранитель ErrorBoundaries
class ErrorBoundary extends Component {
    state = {
        error: false
    }

    //хук для отлова краша приложения
    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage/>
        }

        // Вставка элементов через props.children, сюда попадёт то, что мы передадим в компонент ErrorBoundary, в App.js мы в него помещали  другие компоненты, вот они сюда и подставляются, то есть если ошибки нет, компоненты дальше отобразятся
        return this.props.children; 
    }
}

export default ErrorBoundary;
import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

// FSM
const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false); //Для обновления пагинации персонажей
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false); //Когда персонажи закончились
    
    const {getAllCharacters, process, setProcess} = useMarvelService();

    // Так как useEffect запускается после рендера, то мы можем onRequest вызывать выше, чем она объявлена
    useEffect(() => {
        onRequest(offset, true);
    }, [])

//     // Если надо выполнить отписку в useEffect(пример таймеров) нужно вернуть колбэк
//     useEffect(() => {
//         const timerId = setInterval(() => {count + 1}, 1000);
    
//         return () => {
//             clearInterval(timerId);
//         }
//    }, [something])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true); 
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false); // переключаем в false наше св-йво когда загружены персонажи
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    // console.log('render'); // в react 18.0.0+ версии авто оптимизация batching state, элемент не перерендоривается при каждом изменении стейта, а react склеивает все изменения state в одно изменение выше в функции 4 стейта должны объединится в один рендеринг

    const itemRefs = useRef([]);


    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                // После добавления концепции FSM не работает анимация
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li 
                        className="char__item"
                        key={item.id}
                        //focus ref
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el} //itemRefs.current - массив, в который кладём элементы по порядку
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
                
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <TransitionGroup component={'ul'} className="char__grid">
                {items}
            </TransitionGroup>         
        )
    }
    
    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [process])

    // const items = renderItems(charList);

    return (
        <div className="char__list">
            {elements}
            <button className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

// Аннотация типов PropTypes
// Обязательное значение любого типа isRequired
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired //number instead func for console error
}

export default CharList;
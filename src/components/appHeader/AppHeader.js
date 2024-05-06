import {Link, NavLink} from "react-router-dom";
import "./appHeader.scss";

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Marvel</span> information portal
                </Link>
            </h1>
            <nav className="app__menu">
                <ul>
                    {/* NavLink в отличие от Link имеет стилизацию активной ссылки */}
                    <li><NavLink 
                    end 
                    style={({isActive}) => ({'color': isActive ? '#9f0013' : 'inherit'})} 
                    to="/">Characters</NavLink></li>
                    /
                    <li><NavLink  
                    style={({isActive}) => ({'color': isActive ? '#9f0013' : 'inherit'})} 
                    to="/comics">Comics</NavLink></li> {/* Из-за нестрогого сравнения строк и отсутствия end(exact в версии v5) "подсветка выбранной страницы" будет для всех дочерних путей /comics/{id}*/}
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;

import {lazy, Suspense} from 'react'; // ленивая загрузка, Suspense отвечает за отлов ошибок
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// import {MainPage, ComicsPage, SingleComicLayout} from '../pages'; //webpack автоматически ищет index.js
import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';

// Динамич-е импорты после статических!!!
const Page404 = lazy(() => import('../pages/404')); 
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicLayout = lazy(() => import('../pages/singleComicLayout/SingleComicLayout'));
const SingleCharacterLayout = lazy(() => import('../pages/singleCharacterLayout/SingleCharacterLayout'));
const SinglePage = lazy(() => import('../pages/SinglePage'));

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}> {/*Увидим доп спинер при ленивом дин-м импорте вверху страницы, подгрузка элемента только когда на страцу перешли*/}
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/comics" element={<ComicsPage/>}/>
                            {/*Произвольное название ключа(:id) нашего параметра для формирования дин-х путей*/}
                            <Route path="/comics/:id" element={<SinglePage Component={SingleComicLayout} dataType='comic'/>}/> 
                            <Route path="/characters/:id" element={<SinglePage Component={SingleCharacterLayout} dataType='character'/>}/>
                            <Route path="*" element={<Page404/>}/>
                        </Routes>
                    </Suspense>

                </main>
            </div>
        </Router>
    )
}


export default App;
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';


import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from "../appBanner/AppBanner";

// Хотелось бы вынести функцию по загрузке данных как отдельный аргумент
// Но тогда мы потеряем связь со стэйтами загрузки и ошибки
// А если вынесем их все в App.js - то они будут одни на все страницы

const SinglePage = ({Component, dataType}) => {
        // Дестр-я в переменную
        const {id} = useParams(); // useParams() return key/value in key, that we setup in <Route> App.js - :comicId
        // console.log(useParams());
        const [data, setData] = useState(null);
        const {getComic, getCharacter, clearError, process, setProcess} = useMarvelService();

        useEffect(() => {
            updateData()
        }, [id])

        const updateData = () => {
            clearError();

            switch (dataType) {
                case 'comic':
                    getComic(id).then(onDataLoaded).then(() => setProcess('confirmed'));
                    break;
                case 'character':
                    getCharacter(id).then(onDataLoaded).then(() => setProcess('confirmed'));
            }
        }

        const onDataLoaded = (data) => {
            // console.log(data);
            setData(data);
        }


        return (
            <>
                <AppBanner/>
                {setContent(process, Component, data)}
            </>
        )
}

export default SinglePage;
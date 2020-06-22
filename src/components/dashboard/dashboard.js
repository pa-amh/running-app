import './dashboard.css'
import React, {useEffect, useState} from 'react';
import Modal from '../modal/modal';
import Button from "../button/button";
import Divider from "../divider/divider";
import SummaryData from "../summary-data/summary-data";
import Snackbar from "../snackbar/snackbar";
import {calcData} from "../../utils/data.utils";
import {integerToHhMmSs, decimalToMmSs} from "../../utils/datetime.utils";
import DataList from "../data-list/data-list";

const Dashboard = () => {
    const PORT = process.env.PORT || 3000;

    const [myData, setMyData] = useState(null);
    const [dataError, setError] = useState(false)

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarData, setSnackbarData] = useState(null);

    /**
     * Run on component mount
     */
    useEffect(() => {
        /**
         * Retrieve Data from Database
         * @returns {Promise<void>}
         */
        const fetchData = () => {
            fetch(`http://localhost:${PORT}/data`)
                .then(res => res.json())
                .then(res => setMyData(res))
                .catch(err => setError(err));
        };

        fetchData();
    }, [PORT]);

    /**
     * Handle click of edit data button
     *
     * @param data
     */
    const handleEdit = data => {
        setModalData(data)
        setShowModal(true);
    }

    /**
     * Calculate total distance in data array
     *
     * @returns {string}
     */
    const getTotalDistance = () => {
        if (myData) return calcData(myData, 'distance', 2) + 'Km';
    }

    /**
     * Toggle modal to either show or hide
     */
    const toggleModal = () => {
        if (showModal) setModalData(null);
        setShowModal(!showModal);
    }

    /**
     * Edit existing data
     *
     * @param data
     */
    const editData = data => {
        fetch(`http://localhost:${PORT}/data`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.id,
                date: data.date,
                distance: data.distance,
                minutes: data.minutes,
                seconds: data.seconds
            })
        })
            .then(res => res.json())
            .then(res => {
                setMyData(myData.map(data => (data.id === res[0].id ? res[0] : data)));
                setModalData(null);
            })
            .catch(err => setError(err));
    }

    /**
     * Add data to data array
     *
     * @param data
     */
    const addData = data => {
        fetch(`http://localhost:${PORT}/data`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: data.date,
                distance: data.distance,
                minutes: data.minutes,
                seconds: data.seconds
            })
        })
            .then(res => res.json())
            .then(res => {
                res[0].id = myData.length + 1;
                setMyData([...myData, res[0]]);
            })
            .catch(err => setError(err));
    };

    /**
     * Remove data entry from data array
     *
     * @param data
     */
    const removeData = data => {
        fetch(`http://localhost:${PORT}/data`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.id
            })
        })
            .then(res => res.json())
            .then(res => setMyData(myData.filter(item => item.date !== res[0].date)))
            .then(() => triggerSnackbar(data))
            .catch(err => setError(err));
    }

    /**
     * Trigger toast with removed data for chance to undo
     * @param data
     */
    const triggerSnackbar = (data = {}) => {
        setSnackbarData(data);
        setShowSnackbar(true);
    }

    /**
     * Callback when animation has finished
     *
     * @param event
     */
    const snackAnimationEnd = event => {
        if (event.animationName === 'fadeout') {
            setShowSnackbar(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-container-main">
                <h1>Running dashboard</h1>
                <div className="summary">
                    <SummaryData title="Total distance" data={getTotalDistance()} />
                    <SummaryData title="Total time" data={integerToHhMmSs(myData)} />
                    <SummaryData title="Average Km" data={decimalToMmSs(myData)} />
                </div>
                <Divider />
                <DataList data={myData} handleEdit={handleEdit} handleDelete={removeData} />
                <Divider />
                <Button numBtns="1" role="add" handleClick={toggleModal}>Add new workout</Button>
            </div>
            {showModal &&
                <Modal handleAdd={addData} handleEdit={editData} handleClose={toggleModal} mainData={myData} editData={modalData} /> }
            <Snackbar show={showSnackbar} alert="remove" data={snackbarData} handleAnimationEnd={snackAnimationEnd} handleUndo={addData}/>
        </div>
    )
};

export default Dashboard;

import './dashboard.css'
import React, {useEffect, useState} from 'react';
import Modal from '../modal/modal';
import Button from "../button/button";
import Divider from "../divider/divider";
import SummaryData from "../summary-data/summary-data";
import DataItem from "../data-item/data-item";
import Snackbar from "../snackbar/snackbar";
import {calcData, sortData} from "../../utils/data.utils";
import {integerToHhMm, decimalToMmSs} from "../../utils/datetime.utils";

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
        }

        fetchData();
    }, [PORT]);

    /**
     * Break down json data and return separate items
     */
    const GetData = () => {
        while (!myData) {
            return <h1>Loading...</h1>
        }

        sortData(myData);

        const items = myData.map(data =>
            <DataItem key={data.id} handleEdit={handleEdit}
                      handleDelete={removeData} data={data} />
        );
        return <ul className={`data-list`}>{items}</ul>
    };

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
        if (showModal) {
            setModalData(null)
        }

        setShowModal(!showModal);
    }

    /**
     * Add data to data array
     *
     * @param newData
     */
    const addData = newData => {
        if (modalData) {
            setMyData(myData.map(data => (data.id === newData.id ? newData : data)));
            setModalData(null);
            return;
        }

        newData.id = myData.length + 1;
        setMyData([...myData, newData]);
    };

    /**
     * Remove data entry from data array
     *
     * @param data
     */
    const removeData = data => {
        triggerSnackbar(data);
        setMyData(myData.filter(item => item.date !== data.date));
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
                    <SummaryData title="Total time" data={integerToHhMm(myData)} />
                {/*    <SummaryData title="Average Km" data={decimalToMmSs(myData)} />*/}
                </div>
                <Divider />
                {GetData()}
                <Divider />
                <Button numBtns="1" role="add" handleClick={toggleModal}>Add new workout</Button>
            </div>
            {showModal &&
                <Modal handleAdd={addData} handleClose={toggleModal} mainData={myData} editData={modalData} /> }
            <Snackbar show={showSnackbar} alert="remove" data={snackbarData}
                      handleAnimationEnd={snackAnimationEnd} handleUndo={addData}/>
        </div>
    )
};

export default Dashboard;

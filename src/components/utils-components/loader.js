import React from "react";
import { useSelector } from "react-redux";
import { ClockLoader } from "react-spinners";
import { SpinnerCircular } from 'spinners-react';


const Loader = (props) => {
    const isLoading = useSelector(state => {
        return state.loader.isLoading
    });


    return (

        <div hidden={!isLoading}
            className={(!isLoading && !props.load) ? "loader-model-bg-hidden" : "loader-model-bg-visible"}>
            <div className="sa-modal-bg-inner">
                <div className="loader-model">
                    <div className="container">
                        <div className={"sa-modal-bg loader " + ((!isLoading && !props.load) && 'hide')}>
                            <div className="sa-modal-bg-inner">
                                <div className="container">
                                    <div className="sweet-loading d-flex justify-content-center">
                                        <SpinnerCircular
                                            size={90}
                                            thickness={180}
                                            speed={100}
                                            color="rgba(138, 57, 172, 1)"
                                            secondaryColor="rgba(124, 57, 172, 0.37)"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
};

export default Loader

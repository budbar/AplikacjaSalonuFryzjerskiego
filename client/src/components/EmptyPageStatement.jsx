import React from "react";

const EmptyPageStatement = ({statement}) => {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-primary flex w-60 h-20 rounded-lg text-secondary items-center justify-center font-bold">
                {statement}
            </div>
        </div>
    );
}

export default EmptyPageStatement;
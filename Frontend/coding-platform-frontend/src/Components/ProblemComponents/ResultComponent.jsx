import React from 'react';

function ResultComponent(props) {
    const getStatusClasses = () => {
        switch (props.status) {
          case 'accepted':
            return 'bg-green-500 text-white';
          case 'rejected':
            return 'bg-red-500 text-white';
          case 'pending':
            return 'bg-yellow-500 text-black';
          default:
            return 'bg-gray-500 text-white';
        }
      };
      console.log(props.data.Actual);
      return (
        <div className="status-component border rounded-md p-4 mb-4">
          <div className={`status py-2 px-4 rounded-md ${getStatusClasses()}`}>
            {props.status}
          </div>
          <div className="data-output mt-4 font-mono">
            { props.status === 'rejected' ? ((props.data.message.error).substring(props.data.message.error.indexOf('line') , )) : (`Actual: ${props.data.Actual}  Expected : ${props.data.Expected}`)}
          </div>
        </div>
      );
    };



export default ResultComponent
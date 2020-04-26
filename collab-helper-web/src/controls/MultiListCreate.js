import React from "react";
const MultiList = props => {
  return props.listDetails.map((val, idx) => {
    let requestItem = `requestItem-${idx}`;
    return (
      <div className="form-row" key={val.index}>
        <div className="col">
          <label>Request Item</label>
          <input
            type="text"
            className="form-control required"
            placeholder="Request Item"
            name="requestItem"
            data-id={idx}
            id={requestItem}
          />
          <br/><br/>
        {/* <div className="col p-4"> */}
          {idx === 0 ? (
            <button
              onClick={() => props.add()}
              type="button"
              className="btn btn-primary text-center"
            >
              <i className="fa fa-plus-circle" aria-hidden="true" />
              Add Request Item
            </button>
          ) : 
          (
            <button
              className="btn btn-danger"
              onClick={() => props.delete(val)}
            >
              <i className="fa fa-minus" aria-hidden="true" />
              Remove Request Item
            </button>
          )}
        {/* </div> */}
          <br/><br/>
      </div>
      </div>
    );
  });
};
export default MultiList;

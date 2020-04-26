import React from "react";
import MultiList from "./MultiListCreate";

class MultiListView extends React.Component {
  state = {
    listDetails: [
      {
        index: Math.random(),
        requestItem: ""
      }
    ]
  };
  handleChange = e => {
    if (
      ["requestItem"].includes(
        e.target.name
      )
    ) {
      let listDetails = [...this.state.listDetails];
      listDetails[e.target.dataset.id][e.target.name] = e.target.value;
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };
  addNewRow = e => {
    this.setState(prevState => ({
        listDetails: [
        ...prevState.listDetails,
        {
          index: Math.random(),
          item: ""
        }
      ]
    }));
  };

  deteteRow = index => {
    this.setState({
        listDetails: this.state.listDetails.filter(
        (s, sindex) => index !== sindex
      )
    });
  };

  clickOnDelete(record) {
    this.setState({
        listDetails: this.state.listDetails.filter(r => r !== record)
    });
  }
  render() {
    let { listDetails } = this.state;
    return (
      <div className="content">
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-sm-1" />
            <div className="col-sm-10">
              <h2 className="text-center"> Enter Request Item Details</h2>
              <div className="container">
                <div className="row">
                  <MultiList
                    add={this.addNewRow}
                    delete={this.clickOnDelete.bind(this)}
                    listDetails={listDetails}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-1" />
          </div>
        </form>
      </div>
    );
  }
}
export default MultiListView;

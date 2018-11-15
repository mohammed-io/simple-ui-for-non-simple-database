import React, { Component } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { debounce } from "lodash";
// import Downshift from 'downshift';
import AsyncSelect from "react-select/lib/Async";
import ReactSelect from "react-select";

interface ChangeOrderCustomerModalProps {
  [x: string]: any;
  isOpen: boolean;
  onExit: () => void;
  onCustomerSelected: (customer: any) => void;
  onSearch?: (term: string) => Promise<null>;
  options: any[];
}

export default class ChangeOrderCustomerModal extends Component<
  ChangeOrderCustomerModalProps
> {
  static defaultProps = {
    onSearch: () => {}
  };

  state = {
    selectedCustomer: null,
    isLoading: false
  };

  handleSearch = debounce(term => {
    this.setState({
      isLoading: true
    });

    return this.props.onSearch(term);
  }, 400);

  selectCustomer = customer => {
    this.setState({ selectedCustomer: customer });
  };

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onExit}>
        <ModalHeader>Choose the new customer for the order</ModalHeader>
        <ModalBody>
          <AsyncSelect
            loadOptions={this.handleSearch}
            onChange={this.selectCustomer}
          />
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-success"
            onClick={() =>
              this.props.onCustomerSelected(this.state.selectedCustomer)
            }
          >
            Select Customer
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

import React, { Component } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { debounce } from "lodash";
import Downshift from 'downshift';

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

    console.log(term);

    this.props.onSearch(term).then(() =>
      this.setState({
        isLoading: false
      })
    );
  }, 300);

  selectCustomer = customer => {
    this.setState({ selectedCustomer: customer })
    console.log(customer)
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onExit}>
        <ModalHeader>Choose the new customer for the order</ModalHeader>
        <ModalBody>
          <Downshift
            itemToString={item => item.name || ''}
            onChange={customer =>this.selectCustomer(customer)}>
           {downshift => {
             return (
             <div>
              <ul>
                {
                  this.props.options.map(x => <li>{x.name}</li>)
                }
              </ul>
             </div>);
           }}
          </Downshift>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success">Select Customer</button>
        </ModalFooter>
      </Modal>
    );
  }
}

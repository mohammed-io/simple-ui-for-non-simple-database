import React, { Component } from "react";
import axios from "axios";
import Layout from "../layouts/layout";
import moment from "moment";
import swal from "sweetalert2";
import dynamic from "next/dynamic";
import Pagination from "../components/pagination";
import { debounce } from "lodash";

import {
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  DropdownToggle,
  Input
} from "reactstrap";
import { OrderCommentsModal } from "../components/order-comments-modal";
import ChangeOrderCustomerModal from "../components/change-order-customer-modal";
import _changeLocationModal from "../components/change-location-modal";

interface AsClassOf<T> {
  (): T;
}

const ChangeLocationModal: AsClassOf<_changeLocationModal> = dynamic(
  () => import("../components/change-location-modal"),
  { ssr: false }
);

function evaluateOrNull(func: () => any) {
  try {
    return func();
  } catch {
    return null;
  }
}

export default class Index extends Component {
  state = {
    page: 0,
    totalCount: 0,
    orders: [],
    isLoading: true,
    openStatusDropdown: {},
    selectedOrderComments: [],
    selectedOrderId: 0,
    commentsModalOpen: false,
    changeCustomerModalOpen: false,
    changeLocationModalOpen: false,
    searchedCustomers: [],
    selectedOrderLocation: null,
    searchTerm: ""
  };

  componentDidMount() {
    this.retrieveOrdersForPage();
  }

  toggleStatusDropDown = orderId => {
    this.setState({
      openStatusDropdown: {
        ...this.state.openStatusDropdown,
        [orderId]: !this.state.openStatusDropdown[orderId]
      }
    });
  };

  retrieveOrdersForPage = (page = 1, force = false) => {
    if (page === this.state.page && !force) return;

    axios.get(this.getPaginatedLink(page)).then(res => {
      this.setState({
        orders: res.data.data,
        totalCount: res.data.count,
        page,
        isLoading: false
      });
    });
  };

  nextPage = () => {
    this.retrieveOrdersForPage(this.state.page + 1);
  };

  prevPage = () => {
    this.retrieveOrdersForPage(this.state.page - 1 || 1);
  };

  formatDateTime = time => {
    // for sake of simplicity
    return moment(time).toLocaleString();
  };

  showCommentsOf = orderId => {
    axios.get(`/v1/orders/${orderId}/comments`).then(res => {
      this.setState({
        selectedOrderId: orderId,
        selectedOrderComments: res.data,
        commentsModalOpen: true
      });
    });
  };

  clearComments = () => {
    this.setState({
      selectedOrderId: 0,
      selectedOrderComments: [],
      commentsModalOpen: false
    });
  };

  searchTimeoutHandle;
  handleSearch = term => {
    clearTimeout(this.searchTimeoutHandle);

    this.searchTimeoutHandle = setTimeout(() => {
      this.setState({ searchTerm: term }, () => {
        this.retrieveOrdersForPage(this.state.page, true);
      });
    }, 500);
  };

  getPaginatedLink = page => {
    return `/v1/orders?page=${page}&term=${this.state.searchTerm}`;
  };

  handleSendCOmment = text => {
    return axios
      .post(`/v1/orders/${this.state.selectedOrderId}/comments`, { text })
      .then(res => {
        this.setState({
          selectedOrderComments: [...this.state.selectedOrderComments, res.data]
        });
        return Promise.resolve(null);
      });
  };

  closeChangeCustomerModal = () => {
    this.setState({
      changeCustomerModalOpen: false
    });
  };

  startChangeCustomerOf = order => {
    this.setState({
      selectedOrderId: order.id,
      changeCustomerModalOpen: true
    });
  };

  handleCustomerSearch = term => {
    return axios.get(`/v1/customers/search?term=${term}`).then(res => {
      return Promise.resolve(res.data.map(x => ({label: x.name, id: x.id})));
    });
  };

  handleCustomerSelection = newCustomer => {
    console.log(newCustomer)
    axios
      .patch(`/v1/orders/${this.state.selectedOrderId}`, {
        customerId: newCustomer.id
      })
      .then(res => {
        console.log(res.data)
        this.setState({
          selectedOrderId: 0,
          changeCustomerModalOpen: false,
          orders: this.state.orders.map(order => {
            if (order.id === this.state.selectedOrderId) {
              return { ...order, customer: res.data.customer };
            }
            return order;
          })
        });
      });
  };

  handleLocationChange = coords => {
    console.log(coords);
    axios
      .patch(`/v1/orders/${this.state.selectedOrderId}`, {
        latitude: coords.lat,
        longitude: coords.lng
      })
      .then(res => {
        this.setState({
          selectedOrderId: 0,
          changeLocationModalOpen: false,
          orders: this.state.orders.map(order => {
            if (order.id === this.state.selectedOrderId) {
              return {
                ...order,
                latitude: res.data.latitude,
                longitude: res.data.longitude
              };
            }
            return order;
          })
        });
      });
  };

  showChangeLocationModalFor = order => {
    this.setState({
      selectedOrderId: order.id,
      selectedOrderLocation: { lat: order.latitude, lng: order.longitude },
      changeLocationModalOpen: true
    });
  };

  hideChangeLocationModal = () => {
    this.setState({
      changeLocationModalOpen: false
    });
  };

  changeOrderStatusTo = orderId => (status: string) => {
    const validStatuses = {
      completed: `/v1/orders/${orderId}/complete`,
      cancelledAndRefunded: `/v1/orders/${orderId}/cancel-and-refund`,
      cancelled: `/v1/orders/${orderId}/cancel`,
      processing: `/v1/orders/${orderId}/process`
    };

    const newStatusUrl = validStatuses[status];

    swal({
      text: `Are you sure to change the status to ${status}?`,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true
    })
      .then(({ value }) => {
        if (value && newStatusUrl) return Promise.resolve(value);
        return Promise.reject();
      })
      .then(() => {
        axios.post(newStatusUrl).then(res => {
          this.setState({
            orders: this.state.orders.map(order => {
              if (order.id === orderId) {
                return { ...order, status: res.data.status };
              }
              return order;
            })
          });
        });
      })
      .catch(console.log);
  };

  render() {
    return (
      <Layout>
        <div className="row">
          <div className="col-md-12">
            <ChangeLocationModal
              onConfirm={this.handleLocationChange}
              currentLocation={this.state.selectedOrderLocation}
              onExit={this.hideChangeLocationModal}
              isOpen={this.state.changeLocationModalOpen}
            />
            <ChangeOrderCustomerModal
              options={this.state.searchedCustomers}
              onExit={this.closeChangeCustomerModal}
              onSearch={this.handleCustomerSearch}
              isOpen={this.state.changeCustomerModalOpen}
              onCustomerSelected={this.handleCustomerSelection}
            />
            <OrderCommentsModal
              isOpen={this.state.commentsModalOpen}
              comments={this.state.selectedOrderComments}
              onExit={this.clearComments}
              onCommentSent={this.handleSendCOmment}
            />
            <div>
              <Input
                className="form-control"
                placeholder="Search by Id or Status..."
                onChange={e => {
                  e.persist();
                  this.handleSearch(e.target.value);
                }}
              />
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Customer Name</th>
                    <th>Customer Phone</th>
                    <th>Merchant Name</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Order Date</th>
                    <th>Comments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <div>{evaluateOrNull(() => order.customer.name)}</div>
                        <div>
                          <button
                            onClick={() => this.startChangeCustomerOf(order)}
                            className="btn btn-warning btn-sm"
                          >
                            Change Customer?
                          </button>
                        </div>
                      </td>
                      <td>{evaluateOrNull(() => order.customer.phone)}</td>
                      <td>{evaluateOrNull(() => order.merchant.nameEn)}</td>
                      <td>
                        <ButtonDropdown
                          isOpen={this.state.openStatusDropdown[order.id]}
                          toggle={() => this.toggleStatusDropDown(order.id)}
                        >
                          <DropdownToggle
                            caret
                            className="btn-outline-secondary"
                          >
                            {order.status}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem disabled>Change to:</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem
                              onClick={() =>
                                this.changeOrderStatusTo(order.id)("completed")
                              }
                            >
                              Completed
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                this.changeOrderStatusTo(order.id)("cancelled")
                              }
                            >
                              Cancelled
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                this.changeOrderStatusTo(order.id)(
                                  "cancelledAndRefunded"
                                )
                              }
                            >
                              Canceled and Refunded
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                this.changeOrderStatusTo(order.id)("processing")
                              }
                            >
                              Processing
                            </DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </td>
                      <td>
                        <div>
                          <small>
                            ({order.latitude}, {order.longitude})
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => this.showChangeLocationModalFor(order)}
                        >
                          Change Location
                        </button>
                      </td>
                      <td>{this.formatDateTime(order.date)}</td>
                      <td>
                        <button
                          className="btn btn-info"
                          onClick={() => this.showCommentsOf(order.id)}
                        >
                          Show Comments
                        </button>
                      </td>
                      <td>...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <Pagination
                pageNeighbours={1}
                pageLimit={10}
                totalRecords={this.state.totalCount}
                onPageChanged={({ currentPage }) =>
                  this.retrieveOrdersForPage(currentPage)
                }
              />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

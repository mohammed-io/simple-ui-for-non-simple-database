import React, { Component } from "react";
import axios from "axios";
import Layout from "../layouts/layout";
import moment from 'moment';


export default class Index extends Component {
  state = {
    page: 0,
    orders: [],
    isLoading: true
  };

  componentDidMount() {
    this.retrieveOrdersForPage();
  }

  retrieveOrdersForPage = (page = 1) => {
    if (page === this.state.page) return;

    axios.get(this.getPaginatedLink(page)).then(res => {
      this.setState({
        orders: res.data,
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
    return moment(time).toLocaleString()
  }

  getPaginatedLink = page => {
    return `/orders?page=${page}`;
  };

  render() {
    return (
      <Layout>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Customer Name</th>
                  <th>Customer Phone</th>
                  <th>Merchant Name</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer.name}</td>
                    <td>{order.customer.phone}</td>
                    <td>{order.merchant.nameEn}</td>
                    <td>{order.status}</td>
                    <td>{this.formatDateTime(order.date)}</td>
                    <td>...</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <button
                className="btn btn-sm btn-primary"
                disabled={this.state.isLoading}
                onClick={this.prevPage}
              >
                {"<<"}
              </button>
              <button
                className="btn btn-sm btn-primary"
                disabled={this.state.isLoading}
                onClick={this.nextPage}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

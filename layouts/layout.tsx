import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
} from "reactstrap";

import Link from "next/link";

import "bootswatch/dist/lux/bootstrap.css";

export default class Layout extends Component {
  state = {
    openNavbar: false
  };

  toggleNavbar = () => {
    this.setState({
      openNavbar: !this.state.openNavbar
    });
  };

  render() {
    return (
      <>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Home</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.openNavbar} navbar>
            <Nav navbar>
              <NavItem>
                <Link href="/">
                  <NavLink href="/">Home</NavLink>
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container>
          {this.props.children}
        </Container>
      </>
    );
  }
}

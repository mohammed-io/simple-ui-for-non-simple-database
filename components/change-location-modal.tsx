import React, { Component } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import SelectLocationOnMap from "./select-location-on-map";

interface ChangeLocationModalProps {
  [x: string]: any;
  isOpen: boolean;
  onExit: () => void;
  currentLocation?: { lat: number; lng: Number };
  onConfirm?: (coords: { lat: number; lng: Number }) => {};
}

export default class ChangeLocationModal extends Component<
  ChangeLocationModalProps
> {
  static defaultProps = {
    onExit: () => {},
    currentLocation: { lat: 36.20956640321589, lng: 44.02851596560663 }
  };

  state = {
    location: this.props.currentLocation
  };

  componentDidCatch(e) {
    console.log("Error", e);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        size="lg"
        toggle={this.props.onExit}
      >
        <ModalHeader>Change Location for Order</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <div style={{ height: "80vh" }}>
                <SelectLocationOnMap
                  onLocationChanged={coords =>
                    this.setState({ location: coords })
                  }
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-outline-secondary"
            onClick={this.props.onExit}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={() => this.props.onConfirm(this.state.location)}
          >
            Update Location
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

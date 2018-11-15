import React, { Component } from "react";
import {
  Modal,
  Card,
  CardBody,
  CardHeader,
  ModalBody,
  ModalHeader,
  Input,
  FormGroup
} from "reactstrap";

interface OrderModalProps {
  [x: string]: any;
  comments: any[];
  isOpen: boolean;
  onExit: () => void;
  onCommentSent: (text: string) => Promise<null>;
}

export class OrderCommentsModal extends Component<OrderModalProps> {
  static defaultProps = {
    onExit: () => {}
  };

  state = {
    newComment: ""
  };

  isEmpty = () => {
    return this.props.comments.length === 0;
  };

  sendTheComment = () => {
    this.props.onCommentSent(this.state.newComment).then(() => {
      this.setState({
        newComment: ""
      });
    });
  };

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onExit}>
        <ModalHeader>
          <div>Comments</div>
        </ModalHeader>
        <ModalBody>
          {this.isEmpty() ? (
            <p>No comments on this order</p>
          ) : (
            <div className="row">
              <div className="col-lg-12">
                <section
                  className="row pb-1"
                  style={{ maxHeight: "60vh", overflow: "scroll" }}
                >
                  <div className="col-md-12">
                    <h3>Comments:</h3>
                  </div>
                  <div className="col-md-12">
                    {this.props.comments.map(comment => (
                      <div key={comment.id} className="row">
                        <div className="col-md-12">
                          <Card>
                            <CardHeader>{comment.userId}:</CardHeader>
                            <CardBody>
                              <div>{comment.content}</div>
                            </CardBody>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <Card>
                  <CardHeader>New Comment:</CardHeader>
                  <CardBody>
                    <FormGroup>
                      <Input
                        type="textarea"
                        value={this.state.newComment}
                        onChange={e =>
                          this.setState({ newComment: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <button
                        onClick={this.sendTheComment}
                        className="btn btn-success"
                        disabled={this.state.newComment.length === 0}
                      >
                        Send Comment
                      </button>
                    </FormGroup>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    );
  }
}

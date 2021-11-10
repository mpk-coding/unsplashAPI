import {useDispatch} from "react-redux";
import {useEffect, useRef} from "react";

import {Button, Nav, Row, Col, Tab, Form, FormInput} from "react-bootstrap";
import {userFolderSliceActions} from "../../store/index";
import {v4 as uuid} from "uuid";

const UserFolderTabs = (props) => {
  const dispatch = useDispatch();
  const folders = props.folders;
  const inputRef = useRef();

  const onResetHandler = (event) => {
    if (
      prompt(
        "Do you wish to reset app to default state?\nType: 'yes' to reset."
      ) === "yes"
    ) {
      console.log("resetting");
      localStorage.removeItem("myUnsplash");
      dispatch(userFolderSliceActions.reset());
    }
  };

  const onAddFolderHandler = (event) => {
    const desire = prompt("enter new folder name");

    dispatch(userFolderSliceActions.add(desire));
  };

  const onActiveHandler = (event) => {
    dispatch(userFolderSliceActions.activate(event.target.text));
  };

  //  state slice change
  useEffect(() => {
    localStorage.setItem("myUnsplash", JSON.stringify(folders));
  }, [folders]);
  useEffect(() => {
    console.log("dispatch");
    dispatch(userFolderSliceActions.get());
  }, [dispatch]);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const query = inputRef.current.value.trim();

    if (query.length > 0) {
      dispatch(userFolderSliceActions.search(query));
    }
  };

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row className="p-3">
        <Col>
          <Nav role="search">
            <Nav.Item className="w-100">
              <Form className="d-flex" onSubmit={onSubmitHandler}>
                <Form.Group
                  className="d-flex flex-grow-1 align-items-center bg-primary text-white p-2 rounded"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label className="m-0 p-2">Search</Form.Label>
                  <Form.Control ref={inputRef} type="text" />
                </Form.Group>
                <Button type="submit">Submit</Button>
              </Form>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row className="p-3">
        <Col>
          <Nav variant="pills">
            {folders.map((folder) => {
              if (folder.name) {
                return (
                  <Nav.Item key={uuid()}>
                    <Nav.Link
                      className={props.isActive === folder.name ? "active" : ""}
                      onClick={onActiveHandler}
                      key={uuid()}
                      eventKey={folder.name}
                    >
                      {folder.name}
                    </Nav.Link>
                  </Nav.Item>
                );
              }
              return null;
            })}
            <Nav.Item className="ms-auto">
              <Button onClick={onResetHandler}>RESET</Button>
              <Button onClick={onAddFolderHandler}>Add folder</Button>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default UserFolderTabs;

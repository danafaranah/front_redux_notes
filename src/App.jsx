import "./app.css";
import { useEffect, useRef, useState } from "react";
import { categories } from "./fakeData/Data";
import { FaPen, FaTrash } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNote,
  getNotes,
  saveNote,
  setFilterNotes,
  updateNote,
} from "./redux/noteSlice";

const initialState = {
  title: "",
  description: "",
  category: "",
};

function App() {
  const dispatch = useDispatch();
  const { notes, filterNotes } = useSelector((state) => state.noteStore);
  const refInput = useRef();

  const [isEdit, setIsEdit] = useState(false);

  const [note, setNote] = useState(initialState);
  const [activateLink, setActiveLink] = useState("");

  // state and functions for modal
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    resetState();
  };
  const handleShow = () => setShow(true);
  // end

  useEffect(() => {
    dispatch(getNotes());
    setActiveLink("All Categories");
  }, []);

  const handleCategory = (category) => {
    category === "All Categories"
      ? dispatch(setFilterNotes(notes))
      : dispatch(
          setFilterNotes(notes.filter((note) => note.category === category))
        );
    setActiveLink(category);
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const actions = (e) => {
    e.preventDefault();
    isEdit
      ? dispatch(updateNote(note))
      : dispatch(saveNote({ ...note, date: Date.now() }));
    refInput.current.focus();
    handleClose();
    console.log(notes);
  };

  const resetState = () => {
    setNote(initialState);
    setIsEdit(false);
  };

  const clickUpdate = (note) => {
    setNote(note);
    setIsEdit(true);
    handleShow();
  };

  return (
    <div className="container">
      <div>
        <ul className="nav nav-pills p-3  mb-3 rounded-pill align-items-center">
          {categories.map((category, i) => (
            <li
              className="nav-item"
              key={i}
              onClick={() => handleCategory(category)}
            >
              <a
                className={`nav-link ${category == activateLink && "active"}`}
                href="#"
              >
                {category}
              </a>
            </li>
          ))}

          <li className="nav-item ms-auto">
            <button className="nav-link" onClick={() => handleShow()}>
              <span className="badge rounded-pill text-bg-primary p-3">
                Add Note
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filterNotes.map((note) => (
          <div
            className="col animate__animated animate__jackInTheBox"
            key={note._id}
          >
            <div className="card card-body">
              <div className="d-flex justify-content-between">
                <h5 className="text-truncate w-75 mb-0">{note.title}</h5>
                <i className={`point-${note.category} fa fa-circle`} />
              </div>

              <p className="text-muted">
                {moment(note.date).format("MMM Do YY")}
              </p>
              <p className="text-muted">{note.description}</p>

              <div className="icons">
                <button className="btn" onClick={() => clickUpdate(note)}>
                  <FaPen />
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    dispatch(deleteNote(note._id)),
                      setActiveLink("All Categories");
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*Start Modal Add note */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          className="bg-primary text-white"
          closeButton
          closeVariant="white"
        >
          <Modal.Title>{isEdit ? "Update note" : "Create Note"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={actions}>
            <Form.Group className="mb-3">
              <Form.Label>Note Title</Form.Label>
              <Form.Control
                ref={refInput}
                type="text"
                className="form-control"
                minLength={4}
                placeholder="Enter Title"
                required
                name="title"
                value={note.title}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note Description</Form.Label>
              <Form.Control
                as="textarea"
                className="form-control"
                minLength={10}
                placeholder="Description"
                rows={3}
                required
                name="description"
                value={note.description}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Form.Select
              className="mb-3"
              value={note.category}
              name="category"
              onChange={(e) => handleChange(e)}
              required
            >
              <option value="">Open this select menu</option>
              {/* elimino la opcion All Categories de las opciones, esto lo hago primero filtrando el array categories y el resultado de ese filtro se recorre con el map */}
              {categories
                .filter((category) => category !== "All Categories")
                .map((item, i) => (
                  <option value={item} key={i}>
                    {item}
                  </option>
                ))}
            </Form.Select>

            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/*End Modal Add note */}
    </div>
  );
}

export default App;

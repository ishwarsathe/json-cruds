import { Alert, Container, Row, Col, Form, FormGroup, Label, Input, FormText, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Component } from 'react';
// import '../Class.json';
import Axios from 'axios';
import { element } from 'prop-types';
import axios from 'axios';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classList: [],
      students: [],
      schools: [],

      id: '',
      school_id: '',
      status: '',
      classStudents: [],

      deleteModal: false,
      editModal: false
    }
  }

  componentDidMount() {
    try {
      Axios.get('http://localhost:4000/class')
        .then(data => {
          console.log(data);
          this.setState({ classList: data.data });
        })
      Axios.get('http://localhost:4001/students')
        .then(data => {
          console.log(data);
          this.setState({ students: data.data });
        })
      Axios.get('http://localhost:4002/schools')
        .then(data => {
          console.log(data);
          this.setState({ schools: data.data });
        })
    } catch (err) {
      console.warn("Error: ", err);
    }
  }

  selectSchool = (e) => {
    console.log("Tergeted value: ", e.target.value);
    const schoolData = this.state.schools.filter(element => element.name == e.target.value);
    console.log("schoolData: ", schoolData);
    this.setState({ school_id: schoolData[0].id });
  }

  studentData = (e) => {
    console.log("Tergeted value: ", e.target.value);
    const studentData = this.state.students.filter(element => element.id == e.target.value);
    console.log("studentData: ", studentData);
    this.setState({ classStudents: studentData });
  }

  status = (e) => {
    console.log("Tergeted value: ", e.target.value);
    this.setState({ status: e.target.value });
    const ran = Math.ceil(Math.random() * 1000);
    console.log("ran: ", ran);
  }

  submit = () => {

    if (this.state.editModal) {
      console.log("Update Conditions",this.state.id, this.state.classStudents[0]);
      axios.put(`http://localhost:4000/class/${this.state.id}`, {
        'id': this.state.id,
        'school-id': this.state.school_id,
        "status": this.state.status,
        "students": [
          {
            "student-id": this.state.classStudents[0].id,
            "assignment": ""
          }
        ]
      })
        .then(result => {
          this.componentDidMount();
          alert(`Class is updated ${this.state.id}`);
          this.setState({ editModal: !this.state.editModal })
        })
    } else {
      console.log('submit func', this.state.school_id, this.state.classStudents);
      let id = Math.ceil(Math.random() * 1000);
      axios.post('http://localhost:4000/class', {
        'id': id,
        'school-id': this.state.school_id,
        "status": this.state.status,
        "students": [
          {
            "student-id": this.state.classStudents[0].id,
            "assignment": ""
          }
        ]
      })
        .then(result => {
          this.componentDidMount();
          alert(`Class is created ${id}`);
        })
    }

  }

  updateJson(id) {
    console.log("Update func");
    axios.get(`http://localhost:4000/class/${id}`)
      .then(result => {
        // this.componentDidMount();
        console.log("fetched edit data: ", result.data);
        this.setState({
          school_id: result.data['school-id'],
          status: result.data.status,
          classStudents: result.data.students,
          id: id,
          editModal: !this.state.editModal
        });
      });
  }

  deleteJson(id) {
    console.log("deleteJson", id);
    axios.delete(`http://localhost:4000/class/${id}`)
      .then(result => {
        this.componentDidMount();
        alert(`Class has been deleted for id ${id}`);
      })
  }
  render() {
    const { classList, schools, students, deleteModal, editModal, status, school_id, classStudents, } = this.state;

    return (
      <div className="App">
        <Container>

          <Form>
            <FormGroup row>
              <Label for="exampleEmail" sm={2}>Select School</Label>
              <Col sm={10}>
                <Input type="select" name="select" id="exampleSelect" onChange={(e) => this.selectSchool(e)}>
                  <option value="">--select</option>
                  {schools.map(element => (
                    <option value={element.name}>{element.name}</option>
                  ))}
                </Input>
                {editModal === true ? <div>selectd school id is : {school_id}</div> : null}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="exampleEmail" sm={2}>Select students</Label>
              <Col sm={10}>
                <Input type="select" name="select" id="exampleSelect" onChange={(e) => this.studentData(e)}>
                  <option value="">--select</option>
                  {students.map(element => (
                    <option value={element.id}>{element.id}</option>
                  ))}
                </Input>
                {editModal === true ? <div>selectd students are : {classStudents.map(data => (
                  <li>{data['student-id']}</li>
                ))}</div> : null}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="exampleEmail" sm={2}>Select School Status</Label>
              <Col sm={10}>
                <Input type="select" name="selectMulti" id="exampleSelectMulti" onChange={(e) => this.status(e)}>
                  <option value="">--select</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PASSIVE">Passive</option>
                </Input>
                {editModal === true ? <div>status : {status}</div> : null}
              </Col>
            </FormGroup>
            <Button onClick={() => this.submit()}>{this.state.editModal ? 'update' : 'Submit'}</Button>
          </Form>
          {'\n\n'}
          <Table>
            <thead>
              <tr>
                {/* <th>#</th> */}
                <th>Class ID</th>
                <th>Class Status</th>
                <th>No of students in class</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                classList.map(element => (
                  <tr key={element.id}>
                    {/* <th scope="row">#</th> */}
                    <td scope="row">{element.id}</td>
                    <td>{element.status}</td>
                    <td>{element.students.length}</td>
                    <td>
                      <Button color="primary" size="sm" active onClick={() => this.updateJson(element.id)}>Edit</Button>&nbsp;&nbsp;
                      <Button color="danger" size="sm" active onClick={() => this.deleteJson(element.id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

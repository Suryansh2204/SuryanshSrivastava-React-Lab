import { useState, useEffect,useRef, FormEvent } from "react";
import {
  Alert,
  Container,
  Spinner,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import iItems from "../models/iItems";
import { getItems , addItem} from "../services/items";

const ExpenseTracker = () => {
  const [items, setItems] = useState<iItems[]>([] as iItems[]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getItems();
        setItems(items);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const total = () => {
    let total = 0;
    for (let x = 0; x < items.length; x++) {
        total += items[x].price;
    }
    return total;
  };
  const totalByPayee = (payee: String) => {
    let total = 0;
    for (let x = 0; x < items.length; x++) {
      if (items[x].payeeName === payee) {
        total += items[x].price;
      }
    }
    return total;
  };

  const payeeNameRef=useRef<HTMLSelectElement>(null);
  const productRef=useRef<HTMLInputElement>(null);
  const priceRef=useRef<HTMLInputElement>(null);
  const setDateRef=useRef<HTMLInputElement>(null);

  const addExpense= async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const expense={
        payeeName:payeeNameRef?.current?.value as string,
        product: productRef?.current?.value as string,
        price: parseFloat(priceRef?.current?.value as string) as number,
        setDate: setDateRef?.current?.value as string
    } as Omit<iItems,'id'>;
    const updatedItem=await addItem(expense);
    setItems([...items,updatedItem]);
    handleClose();
  };

  const toPay=(tRahul:number,tRamesh:number)=>{
    let amt=0;
    if(tRahul>tRamesh){
        amt=(tRahul-tRamesh)/2;
        return ["Pay Rahul Rs." ,amt];
    }
    else{
        amt=(tRamesh-tRahul)/2;
        return ["Pay Ramesh Rs." ,amt];
    }
  };

  return (
    <Container className="my-4">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Expense</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={addExpense}>
            <Form.Group className="mb-3" controlId="payeeName">
              <Form.Label>Name</Form.Label>
              <Form.Select aria-label="Payee name" ref={payeeNameRef}>
                <option>--Select Payee--</option>
                <option value="Rahul">Rahul</option>
                <option value="Ramesh">Ramesh</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="product">
              <Form.Label>Product Purchased</Form.Label>
              <Form.Control type="text" placeholder="Description" ref={productRef}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" placeholder="Price" ref={priceRef}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="setDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" placeholder="Date" ref={setDateRef}/>
            </Form.Group>

            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" className="mx-2">
              Add expense
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <h1>
        Expense Tracker
        <Button variant="primary" className="float-end" onClick={handleShow}>
          Add expense
        </Button>
      </h1>
      <hr />

      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {!loading && error && <Alert variant="danger">{error.message}</Alert>}
      {!loading && !error && (
        <Table  bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Payee</th>
              <th>Description</th>
              <th>Date</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className={item.payeeName==='Rahul'?"table-secondary":"table-primary"}>
                <td>{i + 1}</td>
                <td>{item.payeeName}</td>
                <td>{item.product}</td>
                <td>{item.setDate}</td>
                <td className="font-monospace text-end">{item.price}</td>
              </tr>
            ))}

            <tr>
              <td className="text-end" colSpan={4}>
                Total:
              </td>
              <td className="font-monospace text-end">
                {total()}
              </td>
            </tr>
            
            <tr className="table-secondary">
              <td className="text-end" colSpan={4}>
                Rahul paid
              </td>
              <td className="font-monospace text-end">
                {totalByPayee("Rahul")}
              </td>
            </tr>
            
            <tr className="table-primary">
              <td className="text-end" colSpan={4}>
                Ramesh paid
              </td>
              <td className="font-monospace text-end">
                {totalByPayee("Ramesh")}
              </td>
            </tr>
            
            <tr className="text-end table-danger">
                <td colSpan={4}>{toPay(totalByPayee("Rahul"),totalByPayee("Ramesh"))[0]}</td>
                <td colSpan={4}>{toPay(totalByPayee("Rahul"),totalByPayee("Ramesh"))[1]}</td>
            </tr>
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ExpenseTracker;
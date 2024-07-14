import {useState} from "react";
import {useStorage} from "@plasmohq/storage/hook";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.css";
import "~styles.css";

interface FormData {
    url: string
    token: string
}

const OptionsPage = () => {
    const [formValid, setFormValid] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({url: "", token: ""});
    const [_url, setUrl] = useStorage<string>("newshubUrl", "");
    const [_token, setToken] = useStorage<string>("apiToken", "");

    const handleChange = (e) => {
        const {name, value} = e.currentTarget;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = (e) => {
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        }
        setFormValid(true)
        e.preventDefault()
    }

    return (
        <Container>
            <h1>NewsHub Extension Settings</h1>
            <Form noValidate validated={formValid} onSubmit={handleSubmit}>
                <Form.Group controlId="newshubUrl">
                    <Form.Label>NewsHub URL</Form.Label>
                    <Form.Control name="url"
                                  type="url"
                                  value={formData.url}
                                  onChange={handleChange}
                                  required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid URL
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="apiToken">
                    <Form.Label>API Token</Form.Label>
                    <Form.Control name="token"
                                  type="text"
                                  pattern="[a-f0-9]{32}"
                                  value={formData.token}
                                  onChange={handleChange}
                                  required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid API token
                    </Form.Control.Feedback>
                </Form.Group>
                <Button className="submitBtn" type="submit">Save</Button>
            </Form>
        </Container>
    );
}

export default OptionsPage

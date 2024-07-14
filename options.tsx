import {useState} from "react";
import {useStorage} from "@plasmohq/storage/hook";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.css";
import "~styles.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";

interface Settings {
    api_url: string
    api_token: string
}

const OptionsPage = () => {
    const [formValid, setFormValid] = useState<boolean>(false);
    const [settings, _setsettings, {
        setRenderValue,
        setStoreValue
    }] = useStorage<Settings>(
        "settings",
        {"api_url": "", "api_token": ""}
    );

    const handleChange = (e) => {
        const {name, value} = e.currentTarget;
        console.log(name, value);
        setRenderValue({
            ...settings,
            [name]: value,
        });
    }

    const handleSubmit = (e) => {
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        }
        setStoreValue(settings).catch(err => {console.error(err)})
        setFormValid(true)
        e.preventDefault()
    }

    return (
        <Container>
            <h1>NewsHub Extension Settings</h1>
            <Form validated={formValid} onSubmit={handleSubmit}>
                <Form.Group controlId="newshubUrl">
                    <FloatingLabel label="NewsHub instance API URL"
                                   controlId="newshubUrl"
                    >
                        <Form.Control name="api_url"
                                      type="url"
                                      value={settings.api_url}
                                      onChange={handleChange}
                                      required
                        />
                    </FloatingLabel>
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid URL
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="apiToken">
                    <FloatingLabel label="API Token"
                                   controlId="newshubToken"
                    >
                        <Form.Control name="api_token"
                                      type="text"
                                      pattern="[a-f0-9]{32}"
                                      value={settings.api_token}
                                      onChange={handleChange}
                                      required
                        />
                    </FloatingLabel>
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

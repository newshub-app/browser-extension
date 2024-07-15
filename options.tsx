import {useState} from "react";
import {useStorage} from "@plasmohq/storage/hook";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Stack from "react-bootstrap/Stack";

import {Settings} from "~types";

import "bootstrap/dist/css/bootstrap.css";
import "~styles.css";

const OptionsPage = () => {
    const [formValid, setFormValid] = useState<boolean>(false);
    const [settings, _setsettings, {
        setRenderValue,
        setStoreValue,
        remove
    }] = useStorage<Settings>(
        "settings",
        new Settings()
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

    const handleClearSettings = (e) => {
        e.preventDefault()
        e.stopPropagation()
        remove()
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
                                      pattern="[a-f0-9]{40}"
                                      value={settings.api_token}
                                      onChange={handleChange}
                                      required
                        />
                    </FloatingLabel>
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid API token
                    </Form.Control.Feedback>
                </Form.Group>
                <Stack direction="horizontal">
                    <Button className="submitBtn" type="submit">Save</Button>
                    {/* FIXME: when clearing settings the page goes blank */}
                    <Button className="submitBtn ms-auto btn-danger" type="button" onClick={handleClearSettings}>Clear settings</Button>
                </Stack>
            </Form>
        </Container>
    );
}

export default OptionsPage

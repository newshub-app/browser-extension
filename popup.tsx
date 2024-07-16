import {type FormEvent, useEffect, useState} from "react"
import {sendToContentScript} from "@plasmohq/messaging"
import {useStorage} from "@plasmohq/storage/dist/hook";

import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Stack from "react-bootstrap/Stack"
import Alert from "react-bootstrap/Alert"
import {Gear} from "react-bootstrap-icons"

import NewsHubAPI, {type ApiResponse, type Category} from "~newshub";
import type {PageInfo} from "~types";
import {type Settings} from "~types";

import "bootstrap/dist/css/bootstrap.css"
import "~styles.css"

function IndexPopup() {
    const [pageUrl, setPageUrl] = useState<string>("")
    const [pageTitle, setPageTitle] = useState<string>("")
    const [pageDesc, setPageDesc] = useState<string>("")
    const [categories, setCategories] = useState<Category[]>([])
    const [isConfigured, setConfigured] = useState<boolean>(false)
    const [showCreateSuccess, setShowCreateSuccess] = useState<boolean>(false)
    const [showCreateFailure, setShowCreateFailure] = useState<boolean>(false)
    const [settings] = useStorage<Settings>(
        "settings",
        {api_url: "", api_token: ""}
    );

    // load settings
    useEffect(() => {
        if (settings.api_url === "" || settings.api_token === "") {
            setConfigured( false)
            setCategories([])
            console.warn("Extension is not configured. Please set the API URL and token in the settings.")
        } else {
            setConfigured(true)
        }
    }, [settings]);

    // load page info and categories
    useEffect(() => {
        if (isConfigured) {
            const fetchCategories = async () => {
                const api = new NewsHubAPI(settings.api_url, settings.api_token)
                try {
                    const resp = await api.getCategories()
                    setCategories(resp.results)
                } catch (err) {
                    // FIXME: failure handling block never gets executed
                    console.error("Error fetching categories:", err)
                    setConfigured(false)
                }
            }
            fetchCategories().then(() => null)


            sendToContentScript({
                name: "pageinfo"
            }).then((resp: PageInfo) => {
                setPageUrl(resp.url)
                setPageTitle(resp.title)
                setPageDesc(resp.description)
            }).catch(err => {
                console.error("Error getting page info:", err)
            })
        }
    }, [isConfigured])

    const  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        const newshub = new NewsHubAPI(settings.api_url, settings.api_token)
        try {
            await newshub.submitLink({
                url: pageUrl,
                title: pageTitle,
                description: pageDesc,
                category: e.currentTarget.category.value
            })
        } catch (err) {
            setShowCreateFailure(true)
            console.error("Error submitting link:", err)
        } finally {
            setShowCreateSuccess(true)
            e.preventDefault()
        }
    }

    return (
        <Container>
            <Stack direction="horizontal">
                <div>
                    <h3>Add to NewsHub</h3>
                </div>
                <div className="ms-auto">
                    <a href="/options.html" target="_blank" title="Settings"><Gear/></a>
                </div>
            </Stack>

            <Alert show={showCreateSuccess} onClose={() => setShowCreateSuccess(false)} variant="success" dismissible>
                Link submitted successfully.
            </Alert>
            <Alert show={showCreateFailure} onClose={() => setShowCreateFailure(false)} variant="danger" dismissible>
                Failed to submit link.
            </Alert>
            <Alert show={!isConfigured} variant="danger">
                Extension is not properly configured.
            </Alert>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="urlField">
                    <FloatingLabel label="URL">
                        <Form.Control type="text"
                                      onChange={(e) => setPageUrl(e.target.value)}
                                      value={isConfigured ? pageUrl : "Extension is not configured"}
                                      disabled={!isConfigured}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="titleField">
                    <FloatingLabel label="Title">
                        <Form.Control type="text"
                                      onChange={(e) => setPageTitle(e.target.value)}
                                      value={isConfigured ? pageTitle : "Extension is not configured"}
                                      disabled={!isConfigured}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="descField">
                    <FloatingLabel label="Description">
                        <Form.Control as="textarea"
                                      onChange={(e) => setPageDesc(e.target.value)}
                                      value={isConfigured ? pageDesc : "Extension is not configured"}
                                      style={{height: "8em"}}
                                      disabled={!isConfigured}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="categoryField">
                    <FloatingLabel label="Category">
                        <Form.Select name="category" disabled={!isConfigured}>
                            {categories?.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                </Form.Group>
                <Button className="submitBtn"
                        type="submit"
                        disabled={!isConfigured}
                >
                    Add link
                </Button>
            </Form>
        </Container>
    )
}

export default IndexPopup

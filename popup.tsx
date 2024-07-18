// noinspection HtmlUnknownTarget

import {type FormEvent, useEffect, useState} from "react"
import {sendToContentScript} from "@plasmohq/messaging"
import {useStorage} from "@plasmohq/storage/dist/hook";

import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Stack from "react-bootstrap/Stack"
import Alert from "react-bootstrap/Alert"
import {Gear} from "react-bootstrap-icons"

import NewsHubAPI, {type Category} from "~newshub";
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
            console.warn("Extension is not properly configured. Please set a valid API URL and token in the settings.")
        } else {
            setConfigured(true)
        }
    }, [settings]);

    // load page info and categories
    useEffect(() => {
        if (isConfigured) {
            const api = new NewsHubAPI(settings.api_url, settings.api_token)
            api.getCategories().then((data: Array<Category>) => {
                setCategories(data)
            }).catch(err => {
                console.error("Error fetching categories:", err)
                setConfigured(false)
            })

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
        newshub.submitLink({
            url: pageUrl,
            title: pageTitle,
            description: pageDesc,
            category: e.currentTarget.category.value
        }).then(() => {
            setShowCreateSuccess(true)
        }).catch(err => {
            console.error("Error submitting link:", err)
            setShowCreateFailure(true)
        })
        e.preventDefault()
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
                    <Form.Label>URL</Form.Label>
                    <Form.Control type="url"
                                  onChange={(e) => setPageUrl(e.target.value)}
                                  value={isConfigured ? pageUrl : ""}
                                  disabled={!isConfigured}
                    />
                </Form.Group>
                <Form.Group controlId="titleField">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text"
                                  onChange={(e) => setPageTitle(e.target.value)}
                                  value={isConfigured ? pageTitle : ""}
                                  disabled={!isConfigured}
                    />
                </Form.Group>
                <Form.Group controlId="descField">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea"
                                  onChange={(e) => setPageDesc(e.target.value)}
                                  value={isConfigured ? pageDesc : ""}
                                  style={{height: "8em"}}
                                  disabled={!isConfigured}
                    />
                </Form.Group>
                <Form.Group controlId="categoryField">
                    <Form.Label>Category</Form.Label>
                        <Form.Select name="category" disabled={!isConfigured}>
                            {categories?.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </Form.Select>
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

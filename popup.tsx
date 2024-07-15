import {useEffect, useState} from "react"
import {sendToContentScript} from "@plasmohq/messaging"
import {useStorage} from "@plasmohq/storage/dist/hook";

import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Stack from "react-bootstrap/Stack"
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
    const [settings] = useStorage<Settings>(
        "settings",
        {api_url: "", api_token: ""}
    );

    // load settings
    useEffect(() => {
        if (settings.api_url === "" || settings.api_token === "") {
            if (isConfigured) {
                setConfigured(false)
                setCategories([])
            }
            console.warn("Extension is not configured. Please set the API URL and token in the settings.")
        } else {
            setConfigured(true)
        }
    }, [settings]);

    // load page info and categories
    useEffect(() => {
        if (isConfigured) {
            const api = new NewsHubAPI(settings.api_url, settings.api_token)
            api.getCategories().then((resp: ApiResponse<Category>) => {
                setCategories(resp.results)
            }).catch(err => {
                console.error("Error getting categories:", err)
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

            <Form>
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
                        <Form.Select disabled={!isConfigured}>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                </Form.Group>
                <Button className="submitBtn" type="submit">Add link</Button>
            </Form>
        </Container>
    )
}

export default IndexPopup

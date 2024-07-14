import {useEffect, useState} from "react"
import {sendToContentScript} from "@plasmohq/messaging"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Stack from "react-bootstrap/Stack"
import {Gear} from "react-bootstrap-icons"

import "bootstrap/dist/css/bootstrap.css"
import "~styles.css"

function IndexPopup() {
    const [pageUrl, setPageUrl] = useState<string>("")
    const [pageTitle, setPageTitle] = useState<string>("")
    const [pageDesc, setPageDesc] = useState<string>("")

    useEffect(() => {
        sendToContentScript({
            name: "pageinfo"
        }).then(resp => {
            setPageUrl(resp.url)
            setPageTitle(resp.title)
            setPageDesc(resp.description)
        }).catch(err => {
            console.error("error getting page info:", err)
        })
    }, [])

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
                                  value={pageUrl}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="titleField">
                    <FloatingLabel label="Title">
                        <Form.Control type="text"
                                      onChange={(e) => setPageTitle(e.target.value)}
                                      value={pageTitle}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="descField">
                    <FloatingLabel label="Description">
                        <Form.Control as="textarea"
                                      onChange={(e) => setPageDesc(e.target.value)}
                                      value={pageDesc}
                                      style={{height: "8em"}}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Button className="submitBtn" type="submit">Add link</Button>
            </Form>
        </Container>
    )
}

export default IndexPopup

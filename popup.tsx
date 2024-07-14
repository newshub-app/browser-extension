import {useEffect, useState} from "react"
import {sendToContentScript} from "@plasmohq/messaging"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
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
            <h3>Add to NewsHub</h3>
            <Form>
                <Form.Group controlId="urlField">
                    <Form.Label>URL</Form.Label>
                    <Form.Control type="text"
                                  onChange={(e) => setPageUrl(e.target.value)}
                                  value={pageUrl}
                    />
                </Form.Group>
                <Form.Group controlId="titleField">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text"
                                  onChange={(e) => setPageTitle(e.target.value)}
                                  value={pageTitle}
                    />
                </Form.Group>
                <Form.Group controlId="descField">
                    <Form.Label>Description</Form.Label>s
                    <Form.Control type="text"
                                  onChange={(e) => setPageDesc(e.target.value)}
                                  value={pageDesc}
                    />
                </Form.Group>
                <Button className="submitBtn" type="submit">Save to NewsHub</Button>
            </Form>
            <a href="/options.html" target="_blank"><Gear/></a>
        </Container>
    )
}

export default IndexPopup

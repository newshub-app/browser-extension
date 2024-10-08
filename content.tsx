import {useMessage} from "@plasmohq/messaging/dist/hook"

import type {PageInfo} from "~types";

const ContentScriptHandler = () => {
    useMessage<string, PageInfo>(async (req, res) => {
        if (req.name === "pageinfo") {
            const url = window.location.href ?? ""
            const title = document.title ?? ""
            const description = document.querySelector("meta[name='description']")?.getAttribute("content") ?? ""
            res.send({url, title, description})
        }
    })
}

export default ContentScriptHandler

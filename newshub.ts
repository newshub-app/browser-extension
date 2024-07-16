export interface Link {
    id?: number
    url: string
    title: string
    description: string
    category: number
}

export interface Category {
    id: number
    name: string
}

export interface ApiResponse<T> {
    count: number
    next: string
    previous: string
    results: T[]
}

export class NewsHubAPI {
    private readonly apiUrl: string
    private readonly apiToken: string

    constructor(apiUrl: string, apiToken: string) {
        this.apiUrl = apiUrl
        this.apiToken = apiToken
    }

    private async request(endpoint: string, method: string = "GET", data: object = null) {
        const request : RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiToken}`
            },
            body: data === null ? null : JSON.stringify(data)
        }
        const response = await fetch(`${this.apiUrl}${endpoint}`, request)
        return await response.json();
    }

    async getCategories() : Promise<ApiResponse<Category>> {
        return this.request("/category/");
    }

    async getLinks() : Promise<ApiResponse<Link>> {
        return this.request("/link/");
    }

    async submitLink(link: Link) {
        return this.request("/link/", "POST", link);
    }
}

export default NewsHubAPI;

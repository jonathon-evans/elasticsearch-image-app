## Getting Started

First, clone the env and replace the values found in the challenge post

```bash
cp .env.evample .env
```

Next, run the development server:

```bash
npm i && npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) with your browser to see the result.

Click the "Go to dashboard" I left it like this because i'm tired and don't want to fix any file path issues right now :)

## Unit Testing

In the tsconfig.json, make sure that the following value is set. Note that it will overwrite when running the development server

```bash
"jsx": "react",
```

## Thoughts and considerations

When starting to work on this, the first thing I did was check out the elastisearch database. I knew that I wanted to create a webapp that would be able to load these images and be able to use the UI to filter the results in any way that made sense given the data I saw. I did a bit of looking around and decided to go with Next.js as a framework for the application. I have never used Next.js before now, but I thought it would be a good learning experience and would meet all of the requirements for this project.

Challenges
The biggest challenges I faced were dealing with a framework I wasn't experienced in, and getting all of the technologies setup to work together properly. I have managed to not have to actually set up any kind of react project since I was in college so it took a bit of refreshing to get the configurations right for everything :D. Outside of that, some of the challenges I faced were:

- Trying to figure out how to handle images that did not exist or were unavailable. I initially devoted some time to trying to figure out how to filter them out at the DB level but i stopped because I was devoting too much thought and time to it. The issue was that we couldn't filter it from the DB, we would have to pull in the data and then find out if the image was available or not. This would be fine, but I didn't know of a way to get pagination to work with this and always have the query return x amount of results, without potentially having repeats on the following pages. There's definitely a way, but I just didn't devote the time to figuring it out.
- Next issue was just the pagination itself, I ended up just stopping on it because I didn't think it was a necessary feature and I had already spent time getting everything else working. This was just getting on my nerves because I was tired and didn't want to deal with it. I wanted to do something that would have solved this issue and the previous one, and that would have been to try to implement a "Search on Scroll" kind of thing, where we scroll to the bottom of the page, then make a new request and append the results. I thought that would have been a cool way to deal with both issues but I just ran out of time.

Limitations

- Lack of pagination, only allowing a user to see one page | Implemented in the DB but not in the UI
- Security could be improved to only allow authorized requests \* State management could be improved, there are a lot of times where images aren't showing up correctly and it's due to the requests timing / loading time interfering with what's displayed.

Scalability and Maintainability

- Since we don't need to worry with the hosting, I think the large amounts of data could be handled by implementing some caching methodologies. In addition to that, I think my search on scroll solution I discussed before would handle a lot of the data since we wouldn't have to grab a huge amount at once. I'll admit I'm not an expert at handling large amounts of data and could probably have done more research into how to make this more scalable for that
- For the maintainability, I think we have a solid way of adding more data sources. Especially because all image sources should have some sort of attribute for the Image, Date of upload, and who uploaded it. Those are the main filters now and the UI should be able to have some minimal adjustments to support any differences. The API Is an easy adjustment as well, we would just need to add some new util method for the other data source and pull that in to the GET images route. Could be some issues with performance if the requests take too long but that could surely be optimized.

Changes I would make with more time

- More UI Polishing and cleanup. Areas like DateRangePicker.tsx could use better error handling and state management
- More logging across UI where applicable
- Better state management
- Pagination support

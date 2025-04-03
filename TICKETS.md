# Tech Visit @ Cloudflight - The AI powered call-center

Recently, the new capabilities of LLM's have opened up a whole new world of business applications. In todays workshop you will explore one of these applications: An AI powered call-center. The business case is the following: A wholesales company wants to improve the availability of their call-center where customers can place oders. Therefore, a new phone line is created where customers can simply leave a voicemail with their order. An AI pipeline will then analyse the voicemail and produce an order which is sent to the ordering software, where employees can check and confirm the orders before they are placed. The pipeline consists of 5 steps:

## Voice 2 Order Pipeline:
1. Retrieve new voice message (audio data) from the voicemail server.
2. Transcribe the audio data i.e. recognize the speech of the voicemail as text data.
3. Recognize the relevant words in the text data that relate to the order (products, quantities and packaging units).
4. Find which of the articles from the inventory matches with each of the products recognized in the voice message.
5. Collect the matched articles together with their quantitis and send the order to the ordering software API.

For the sake of time we will assume for today that the speech recognition has already been implemented and performed, so that our pipeline starts with text messages. The focus of the workshop is the third step: recognizing relevant words. In machine learning this is called named entity recognition (NER). The goal is to implement and evaluate a solution for the NER step. As a bonus, you will also
get to implement an LLM-based product search.

<br/><br/>
# Ticket 1: Generating a Dataset for evaluation

> Your job is to add code in the `generate_xxxx.ipynb` notebooks in order to generate a dataset that can be used. 

### Generating a dataset for training and evaluation
The customer didn't provide any training data, just information about the products they have. So, we will need to fabricate our own training and testing datasets. They only provided the data stored in the [data](./data/) folder.

To do so the first thing we will do is generate a set of products from the product data, in a way they would appear in a sentence spoken by a human. Have a look at [data_generation/generate_item_examples](data_generation/generate_item_examples.ipynb). Run this file to generate a set of 20 products. The product names contain a lot of symbols and parts that a human wouldn't mention. Implement the `clean_product_name()` method so that the file generates sensible product names. For example, remove dimensions from the names. Humans probably don't mention them. The performance of the pipeline depends on the quality of this training data!

Once you feel like you got a good set of product names, generate as many examples as possible, maybe even with variations for the same product. Check the contents again and clean further if necessary. When done, generate order examples by running the [data_generation/generate_order_examples](generate_order_examples.ipynb) file. The goal is to implement the `generate_order_example()` method. There is a way to do this using LLM's, but you can also go with a more conventional approach. A basis for using GPT-4o is provided in [utils.py](data_generation/utils.py)

The sentences you generate will be stored in [data/order_examples](data/order_examples/).

<br/><br/>
# Ticket 2: Implementing an NER solution

> Your job is to write system prompts that are able to generate an order from a user message.

Run the little web app we created for you using `npm run dev`. Open your browser and go to `localhost:3000`. Here you will see the app where you can do several things. The main goal is to define the 2 system prompts so that when you send a message, the items you mentioned appear in the product list at the bottom. For this to work it is important that the output of the LLMs has the right format for each step! Look at the code in [page.tsx](app/page.tsx) to understand what is needed. Keep in mind that the product data is in German!

**Note**: If you have a bug in your prompts, the app might get stuck in "thinking" mode. Open the console in your browser then you should see an error that points you in the right direction.

**Tip**: You have to include the whole list of products in the prompt, so that the model can choose the right product based on the customer message. Here is a useful link with some tips if you have no idea where to start: https://www.promptingguide.ai/ 



To test if your implementation works, use some of the example orders you created before! Some other ideas:
- Does it work for multiple products?
- Does it work if you order something and cancel it in the same message?
- Does it work if you order something by weight? Does the model calculate the right amount of units?
- Does it work if you use an implicit amount like "double as many..."
- Does it work if the customer mentions a product but doesn't actually mean to order it?
- Can you think of other edge cases that might happen when ordering?

BONUS: Try if you can make the system allow you to order a product that is not in the dataset, without changing the system prompts! So use a smart message structure to fool the system. This is called prompt injection.

<br/><br/>
# Ticket 3: Pipeline architecture

In this last ticket you will design a solution for the architecture of the whole solution. This AI pipeline is only a small part of the actual system! 

Make groups of 3-5 people, give your team a nice name and construct an architecture block diagram for the whole system. Think about answering the following questions: 

- Voicemails are not stored on-site. How to get new messages into our pipeline?
- Where do components run: Speech recognition, entity recognition, pipeline, search
- How does the product search get its data?
- (How) should we store order proposals?
- What happens with the order proposals? (To webshop)
- Make sure we don‘t violate GDPR
- Do we need user authentication? Where?
- What about training the models? Do we need extra infrastructure?
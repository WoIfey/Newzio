import { Profanity, ProfanityOptions } from '@2toad/profanity'

const options = new ProfanityOptions()
options.wholeWord = false
options.grawlix = '****'
options.grawlixChar = '*'

export const profanity = new Profanity(options)
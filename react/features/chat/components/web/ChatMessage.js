// @flow

import React from 'react';
import { toArray } from 'react-emoji-render';


import { translate } from '../../../base/i18n';
import { Linkify } from '../../../base/react';
import { MESSAGE_TYPE_LOCAL } from '../../constants';
import AbstractChatMessage, {
    type Props
} from '../AbstractChatMessage';
import PrivateMessageButton from '../PrivateMessageButton';

/**
 * Renders a single chat message.
 */
class ChatMessage extends AbstractChatMessage<Props> {

    
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let isFile = false;
        const { message, t } = this.props;
        const processedMessage = [];

        const txt = this._getMessageText();
        
        const base64Regex = new RegExp(/^data:.*;base64,.*/);
        if(base64Regex.test(txt)) {
            isFile = true;
        }
        // Tokenize the text in order to avoid emoji substitution for URLs.
        const tokens = txt.split(' ');

        // Content is an array of text and emoji components
        const content = [];

        for (const token of tokens) {
            if (token.includes('://') || base64Regex.test(txt)) {
                // It contains a link, bypass the emojification.
                content.push(token);
            } else {
                content.push(...toArray(token, { className: 'smiley' }));
            }

            content.push(' ');
        }
        
        content.forEach(i => {
            if (typeof i === 'string' && i !== ' ' && !base64Regex.test(i) ) {
                processedMessage.push(<Linkify key = { i }>{ i }</Linkify>);
            } else {
                if(base64Regex.test(i)) 
                {
                    const file = {
                        file : i.split('@')[0],
                        fileName : i.split('@')[1]
                    }
                    processedMessage.push(file)
                } else {

                    processedMessage.push(i);
                }
            }
        });

        return (
            <div
                className = 'chatmessage-wrapper'
                tabIndex = { -1 }>
                <div className = { `chatmessage ${message.privateMessage ? 'privatemessage' : ''}` }>
                    <div className = 'replywrapper'>
                        <div className = 'messagecontent'>
                            { this.props.showDisplayName && this._renderDisplayName() }
                            <div className = 'usermessage'>
                                <span className = 'sr-only'>
                                    { this.props.message.displayName === this.props.message.recipient
                                        ? t('chat.messageAccessibleTitleMe')
                                        : t('chat.messageAccessibleTitle',
                                        { user: this.props.message.displayName }) }
                                </span>
                                { isFile ? 
                                // {processedMessage}
                                <a href={this._toBlob(processedMessage[0].file)} target="_blank" download>{processedMessage[0].fileName}</a>
                                
                                
                                
                                : processedMessage }
                            </div>
                            { message.privateMessage && this._renderPrivateNotice() }
                        </div>
                        { message.privateMessage && message.messageType !== MESSAGE_TYPE_LOCAL
                            && (
                                <div className = 'messageactions'>
                                    <PrivateMessageButton
                                        participantID = { message.id }
                                        reply = { true }
                                        showLabel = { false } />
                                </div>
                            ) }
                    </div>
                </div>
                { this.props.showTimestamp && this._renderTimestamp() }
            </div>
        );
    }
     _toBlob (base64String){
        const type = base64String.split(';')[0].split(':')[1];
        const b64 =  base64String.split(',')[1]
        const byteCharacters = atob(b64);
        
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type});
        
        return URL.createObjectURL(blob)
    }

    _getFormattedTimestamp: () => string;

    _getMessageText: () => string;

    _getPrivateNoticeMessage: () => string;

    /**
     * Renders the display name of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderDisplayName() {
        return (
            <div
                aria-hidden = { true }
                className = 'display-name'>
                { this.props.message.displayName }
            </div>
        );
    }

    /**
     * Renders the message privacy notice.
     *
     * @returns {React$Element<*>}
     */
    _renderPrivateNotice() {
        return (
            <div className = 'privatemessagenotice'>
                { this._getPrivateNoticeMessage() }
            </div>
        );
    }

    /**
     * Renders the time at which the message was sent.
     *
     * @returns {React$Element<*>}
     */
    _renderTimestamp() {
        return (
            <div className = 'timestamp'>
                { this._getFormattedTimestamp() }
            </div>
        );
    }
}

export default translate(ChatMessage);

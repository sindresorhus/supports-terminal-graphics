import process from 'node:process';
import test from 'ava';
import {createSupportsTerminalGraphics} from './index.js';

const getSupport = ({env = {}, stream}) => {
	const oldEnv = process.env;

	Object.defineProperty(process, 'env', {value: env});

	const result = createSupportsTerminalGraphics(stream);

	Object.defineProperty(process, 'env', {value: oldEnv});

	return result;
};

// Kitty protocol tests

test('kitty: supported with KITTY_WINDOW_ID', t => {
	const support = getSupport({env: {KITTY_WINDOW_ID: '1'}});
	t.true(support.kitty);
});

test('kitty: supported with KITTY_PID', t => {
	const support = getSupport({env: {KITTY_PID: '12345'}});
	t.true(support.kitty);
});

test('kitty: supported with GHOSTTY_RESOURCES_DIR', t => {
	const support = getSupport({env: {GHOSTTY_RESOURCES_DIR: '/usr/share/ghostty'}});
	t.true(support.kitty);
});

test('kitty: supported with WEZTERM_PANE', t => {
	const support = getSupport({env: {WEZTERM_PANE: '0'}});
	t.true(support.kitty);
});

test('kitty: supported with WEZTERM_UNIX_SOCKET', t => {
	const support = getSupport({env: {WEZTERM_UNIX_SOCKET: '/tmp/wezterm.sock'}});
	t.true(support.kitty);
});

test('kitty: supported with LC_TERMINAL=WezTerm', t => {
	const support = getSupport({env: {LC_TERMINAL: 'WezTerm'}});
	t.true(support.kitty);
});

test('kitty: supported with TERM_PROGRAM=kitty', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'kitty'}});
	t.true(support.kitty);
});

test('kitty: supported with TERM_PROGRAM=ghostty', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'ghostty'}});
	t.true(support.kitty);
});

test('kitty: supported with TERM_PROGRAM=WezTerm', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'WezTerm'}});
	t.true(support.kitty);
});

test('kitty: supported with TERM_PROGRAM=iTerm.app version 3.6+', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.6.0'}});
	t.true(support.kitty);
});

test('kitty: not supported with TERM_PROGRAM=iTerm.app version 3.5', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.0'}});
	t.false(support.kitty);
});

test('kitty: not supported with TERM_PROGRAM=iTerm.app without version', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'iTerm.app'}});
	t.false(support.kitty);
});

test('kitty: supported with TERM_PROGRAM=Konsole and new version', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole', KONSOLE_VERSION: '220400'}});
	t.true(support.kitty);
});

test('kitty: not supported with TERM_PROGRAM=Konsole and old version', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole', KONSOLE_VERSION: '210000'}});
	t.false(support.kitty);
});

test('kitty: not supported with TERM_PROGRAM=Konsole and no version', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole'}});
	t.false(support.kitty);
});

test('kitty: supported with TERM_PROGRAM=rio', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'rio'}});
	t.true(support.kitty);
});

test('kitty: supported with TERM_PROGRAM=WarpTerminal', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'WarpTerminal'}});
	t.true(support.kitty);
});

test('kitty: supported with TERM=xterm-kitty', t => {
	const support = getSupport({env: {TERM: 'xterm-kitty'}});
	t.true(support.kitty);
});

test('kitty: supported with TERM=xterm-ghostty', t => {
	const support = getSupport({env: {TERM: 'xterm-ghostty'}});
	t.true(support.kitty);
});

test('kitty: supported with KONSOLE_VERSION >= 220400', t => {
	const support = getSupport({env: {KONSOLE_VERSION: '220400'}});
	t.true(support.kitty);
});

test('kitty: not supported with old KONSOLE_VERSION', t => {
	const support = getSupport({env: {KONSOLE_VERSION: '210000'}});
	t.false(support.kitty);
});

test('kitty: not supported with non-tty stream', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'kitty'},
		stream: {isTTY: false},
	});
	t.false(support.kitty);
});

test('kitty: not supported with empty env', t => {
	const support = getSupport({env: {}});
	t.false(support.kitty);
});

// ITerm2 protocol tests

test('iterm2: supported with iTerm.app version 2.9.20150512+', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '2.9.20150512'},
	});
	t.true(support.iterm2);
});

test('iterm2: not supported with iTerm.app version 2.9.20150511', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '2.9.20150511'},
	});
	t.false(support.iterm2);
});

test('iterm2: supported with TERM_PROGRAM=WezTerm', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'WezTerm'}});
	t.true(support.iterm2);
});

test('iterm2: not supported with WezTerm version before 20220319', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'WezTerm', TERM_PROGRAM_VERSION: '20220318-000000-00000000'},
	});
	t.false(support.iterm2);
});

test('iterm2: supported with WezTerm version 20220319+', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'WezTerm', TERM_PROGRAM_VERSION: '20220319-142410-0fcdea07'},
	});
	t.true(support.iterm2);
});

test('iterm2: supported with WEZTERM_PANE', t => {
	const support = getSupport({env: {WEZTERM_PANE: '0'}});
	t.true(support.iterm2);
});

test('iterm2: supported with WEZTERM_UNIX_SOCKET', t => {
	const support = getSupport({env: {WEZTERM_UNIX_SOCKET: '/tmp/wezterm.sock'}});
	t.true(support.iterm2);
});

test('iterm2: supported with vscode version 1.80+', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.80.0'},
	});
	t.true(support.iterm2);
});

test('iterm2: supported with vscode version 2.0', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '2.0.0'},
	});
	t.true(support.iterm2);
});

test('iterm2: not supported with vscode version 1.79', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.79.0'},
	});
	t.false(support.iterm2);
});

test('iterm2: supported with TERM_PROGRAM=mintty', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'mintty'}});
	t.true(support.iterm2);
});

test('iterm2: supported with TERM_PROGRAM=Konsole and new version', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole', KONSOLE_VERSION: '220400'}});
	t.true(support.iterm2);
});

test('iterm2: not supported with TERM_PROGRAM=Konsole and old version', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole', KONSOLE_VERSION: '210000'}});
	t.false(support.iterm2);
});

test('iterm2: supported with rio version 0.1.13+', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'rio', TERM_PROGRAM_VERSION: '0.1.13'},
	});
	t.true(support.iterm2);
});

test('iterm2: supported with rio version 0.2.0', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'rio', TERM_PROGRAM_VERSION: '0.2.0'},
	});
	t.true(support.iterm2);
});

test('iterm2: supported with rio version 1.0.0', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'rio', TERM_PROGRAM_VERSION: '1.0.0'},
	});
	t.true(support.iterm2);
});

test('iterm2: not supported with rio version 0.1.12', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'rio', TERM_PROGRAM_VERSION: '0.1.12'},
	});
	t.false(support.iterm2);
});

test('iterm2: supported with LC_TERMINAL=iTerm2', t => {
	const support = getSupport({env: {LC_TERMINAL: 'iTerm2'}});
	t.true(support.iterm2);
});

test('iterm2: supported with LC_TERMINAL=WezTerm', t => {
	const support = getSupport({env: {LC_TERMINAL: 'WezTerm'}});
	t.true(support.iterm2);
});

test('iterm2: supported with KONSOLE_VERSION >= 220400', t => {
	const support = getSupport({env: {KONSOLE_VERSION: '220400'}});
	t.true(support.iterm2);
});

test('iterm2: not supported with non-tty stream', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.4.0'},
		stream: {isTTY: false},
	});
	t.false(support.iterm2);
});

test('iterm2: not supported with empty env', t => {
	const support = getSupport({env: {}});
	t.false(support.iterm2);
});

// Sixel protocol tests

test('sixel: supported with TERM_PROGRAM=WezTerm', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'WezTerm'}});
	t.true(support.sixel);
});

test('sixel: not supported with WezTerm version before 20200620', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'WezTerm', TERM_PROGRAM_VERSION: '20200619-000000-00000000'},
	});
	t.false(support.sixel);
});

test('sixel: supported with WezTerm version 20200620+', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'WezTerm', TERM_PROGRAM_VERSION: '20200620-160318-e00b076c'},
	});
	t.true(support.sixel);
});

test('sixel: supported with WEZTERM_PANE', t => {
	const support = getSupport({env: {WEZTERM_PANE: '0'}});
	t.true(support.sixel);
});

test('sixel: supported with WEZTERM_UNIX_SOCKET', t => {
	const support = getSupport({env: {WEZTERM_UNIX_SOCKET: '/tmp/wezterm.sock'}});
	t.true(support.sixel);
});

test('sixel: supported with TERM=mlterm', t => {
	const support = getSupport({env: {TERM: 'mlterm'}});
	t.true(support.sixel);
});

test('sixel: supported with TERM=mlterm-256color', t => {
	const support = getSupport({env: {TERM: 'mlterm-256color'}});
	t.true(support.sixel);
});

test('sixel: supported with vscode version 1.80+', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.80.0'},
	});
	t.true(support.sixel);
});

test('sixel: not supported with vscode version 1.79', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.79.0'},
	});
	t.false(support.sixel);
});

test('sixel: supported with TERM_PROGRAM=mintty', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'mintty'}});
	t.true(support.sixel);
});

test('sixel: supported with TERM_PROGRAM=rio version 0.1.12+', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'rio', TERM_PROGRAM_VERSION: '0.1.12'},
	});
	t.true(support.sixel);
});

test('sixel: not supported with TERM_PROGRAM=rio version 0.1.11', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'rio', TERM_PROGRAM_VERSION: '0.1.11'},
	});
	t.false(support.sixel);
});

test('sixel: supported with TERM_PROGRAM=Konsole and new version', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole', KONSOLE_VERSION: '220400'}});
	t.true(support.sixel);
});

test('sixel: not supported with TERM_PROGRAM=Konsole and old version', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole', KONSOLE_VERSION: '210000'}});
	t.false(support.sixel);
});

// Note: foot supports Sixel but doesn't set TERM_PROGRAM, so it cannot be detected via env vars

test('sixel: not supported with iTerm.app', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.0.0'},
	});
	t.false(support.sixel);
});

test('sixel: supported with KONSOLE_VERSION >= 220400', t => {
	const support = getSupport({env: {KONSOLE_VERSION: '220400'}});
	t.true(support.sixel);
});

test('sixel: not supported with non-tty stream', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'WezTerm'},
		stream: {isTTY: false},
	});
	t.false(support.sixel);
});

test('sixel: not supported with empty env', t => {
	const support = getSupport({env: {}});
	t.false(support.sixel);
});

// Multi-protocol tests

test('WezTerm supports all three protocols', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'WezTerm'}});
	t.true(support.kitty);
	t.true(support.iterm2);
	t.true(support.sixel);
});

test('Ghostty detected via GHOSTTY_RESOURCES_DIR only supports kitty', t => {
	const support = getSupport({env: {GHOSTTY_RESOURCES_DIR: '/usr/share/ghostty'}});
	t.true(support.kitty);
	t.false(support.iterm2);
	t.false(support.sixel);
});

test('mlterm only supports sixel', t => {
	const support = getSupport({env: {TERM: 'mlterm'}});
	t.false(support.kitty);
	t.false(support.iterm2);
	t.true(support.sixel);
});

test('Kitty only supports kitty protocol', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'kitty'}});
	t.true(support.kitty);
	t.false(support.iterm2);
	t.false(support.sixel);
});

test('Ghostty only supports kitty protocol', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'ghostty'}});
	t.true(support.kitty);
	t.false(support.iterm2);
	t.false(support.sixel);
});

test('VS Code 1.80+ supports iterm2 and sixel but not kitty', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.80.0'},
	});
	t.false(support.kitty);
	t.true(support.iterm2);
	t.true(support.sixel);
});

test('Konsole 22.04+ supports all three protocols', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole', KONSOLE_VERSION: '220400'}});
	t.true(support.kitty);
	t.true(support.iterm2);
	t.true(support.sixel);
});

test('Old Konsole supports nothing', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'Konsole', KONSOLE_VERSION: '210000'}});
	t.false(support.kitty);
	t.false(support.iterm2);
	t.false(support.sixel);
});

test('iTerm2 3.6+ supports kitty and iterm2', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.6.0'},
	});
	t.true(support.kitty);
	t.true(support.iterm2);
	t.false(support.sixel);
});

test('iTerm2 3.4 supports iterm2 but not kitty or sixel', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.4.0'},
	});
	t.false(support.kitty);
	t.true(support.iterm2);
	t.false(support.sixel);
});

// Edge case tests

test('iTerm.app without version returns false for iterm2', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'iTerm.app'}});
	t.false(support.iterm2);
});

test('iTerm.app without version returns false for sixel', t => {
	const support = getSupport({env: {TERM_PROGRAM: 'iTerm.app'}});
	t.false(support.sixel);
});

test('sixel: supported with LC_TERMINAL=WezTerm', t => {
	const support = getSupport({env: {LC_TERMINAL: 'WezTerm'}});
	t.true(support.sixel);
});

test('works with TTY stream', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'kitty'},
		stream: {isTTY: true},
	});
	t.true(support.kitty);
});

test('returns false for stream without isTTY property', t => {
	const support = getSupport({
		env: {TERM_PROGRAM: 'kitty'},
		stream: {},
	});
	t.false(support.kitty);
});

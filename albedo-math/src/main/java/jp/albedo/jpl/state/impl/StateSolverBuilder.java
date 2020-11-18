package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.KernelRepository;
import jp.albedo.jpl.state.StateSolver;

public class StateSolverBuilder {

    private final KernelRepository kernel;

    private JplBody targetBody;

    private JplBody observerBody;

    public StateSolverBuilder(KernelRepository kernel) {
        this.kernel = kernel;
    }

    public StateSolver build() throws JplException {
        if (targetBody == null || observerBody == null) {
            throw new IllegalStateException("Cannot build StateSolver without information about target body and observer body!");
        }

        return new StateSolver(kernel, targetBody, observerBody);
    }

    public StateSolverBuilder target(JplBody targetBody) {
        this.targetBody = targetBody;
        return this;
    }

    public StateSolverBuilder observer(JplBody observerBody) {
        this.observerBody = observerBody;
        return this;
    }

}
